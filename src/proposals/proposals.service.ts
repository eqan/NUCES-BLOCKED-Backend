import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { DeployedContracts } from 'src/contracts/deployedAddresses';
import { In, Like, Repository } from 'typeorm';
import * as ABI from '../contracts/DAO.json';
import { FilterProposalInput } from './dto/filter.proposals.dto';
import { GetAllProposals } from './dto/get-all-proposals.dto';
import { Proposal } from './entities/proposals.entity';
import { CreateProposalDto } from './dto/create-proposal.input';
import { BigNumber } from '@ethersproject/bignumber';
import { ProposalStatusEnum } from './entities/enums/status.enum';

@Injectable()
export class ProposalsService {
  private readonly logger = new Logger('Proposals-DataFetch-Cron');
  private readonly jobName = 'fetch-proposals-from-blockchain';
  private job: CronJob;
  constructor(
    @InjectRepository(Proposal)
    private proposalRepo: Repository<Proposal>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    try {
      this.job = new CronJob(
        CronExpression.EVERY_MINUTE,
        this.dataFetchingFromBlockchain.bind(this),
      );
      this.schedulerRegistry.addCronJob(this.jobName, this.job);
      this.logger.log(`Job ${this.jobName} initialized to run every minute`);
      this.startProcess();
    } catch (error) {
      this.logger.error(error);
    }
  }

  startProcess() {
    try {
      this.job.start();
      this.logger.log(`Job ${this.jobName} started`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  stopProcess() {
    try {
      this.job.stop();
      this.logger.log(`Job ${this.jobName} stopped`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  convertToEnum(status: number): ProposalStatusEnum {
    switch (status) {
      case 0:
        return ProposalStatusEnum.NOT_STARTED;
      case 1:
        return ProposalStatusEnum.IN_PROGRESS;
      case 2:
        return ProposalStatusEnum.COMPLETED;
      default:
        break;
    }
  }

  async dataSaveFromBlockchainToDB(
    contract: any,
    from: number,
    to: number,
    toSave: boolean,
  ) {
    const proposals = await contract.functions.getProposalsWithCurrentStatuses(
      from,
      to,
      { from: process.env.CONTRACT_OWNER },
    );
    for (const proposal of proposals[0]) {
      if (proposal['proposalName'] != '') {
        const yesVotes: number = BigNumber.from(
          proposal['yesVotes'],
        ).toNumber();
        const noVotes: number = BigNumber.from(proposal['noVotes']).toNumber();
        const data = {
          id: proposal['proposalName'],
          description: proposal['description'],
          yesVotes: yesVotes,
          noVotes: noVotes,
          status: this.convertToEnum(proposal['status']),
        };
        console.log(data);
        try {
          if (toSave) {
            await this.proposalRepo.save(data);
          } else {
            await this.proposalRepo.update({ id: data.id }, { ...data });
          }
        } catch (error) {
          console.log(error.message);
          this.logger.error('Duplicate Proposal Data Found!');
        }
      }
    }
  }

  // Cron job implementation for automatically retrieving and storing data from blockchain into db
  async dataFetchingFromBlockchain() {
    try {
      const provider = new JsonRpcProvider(process.env.RPC_URL);
      const abiArray = ABI.abi as any[];
      const contract = new Contract(DeployedContracts.DAO, abiArray, provider);

      const dataCountLocal = await this.proposalRepo.count();
      const dataCountBlockchain = (
        await contract.functions.getNumberOfProposals()
      )[0].toNumber();
      if (dataCountLocal < dataCountBlockchain) {
        const CHUNK_SIZE = 100;
        const fromproposalIndex = Math.max(0, dataCountLocal - CHUNK_SIZE);
        let toproposalIndex = dataCountLocal + CHUNK_SIZE;
        if (toproposalIndex > dataCountBlockchain)
          toproposalIndex = dataCountBlockchain;
        await this.dataSaveFromBlockchainToDB(
          contract,
          fromproposalIndex,
          toproposalIndex,
          true,
        );
        this.logger.verbose(
          `Fetched ${toproposalIndex - fromproposalIndex} proposals`,
        );
      } else {
        this.logger.log('No more proposals to fetch!');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Create Proposal
   * @params createUse
   * @return Proposals
   */
  async create(createProposalInput: CreateProposalDto): Promise<Proposal> {
    try {
      const proposal = this.proposalRepo.create(createProposalInput);
      await this.proposalRepo.save(proposal);
      const data = (await this.index({ id: createProposalInput.id })).items[0];
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Proposals
   * @param updateProposalsInput
   * @returns updated user
   */
  async updateAllStatusesFromBlockchainAndDatabase() {
    try {
      const provider = new JsonRpcProvider(process.env.RPC_URL);
      const abiArray = ABI.abi as any[];
      const contract = new Contract(DeployedContracts.DAO, abiArray, provider);
      const dataCountBlockchain = (
        await contract.functions.getNumberOfProposals()
      )[0].toNumber();
      await this.dataSaveFromBlockchainToDB(
        contract,
        0,
        dataCountBlockchain,
        false,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

    /**
   * DELETE Results
   * @param deleteProposals
   * @returns Message that user successfully deleted
   */
    async delete(deleteWithIds: { id: string[] }): Promise<void> {
      try {
        const ids = deleteWithIds.id;
        await this.proposalRepo.delete({ id: In(ids) });
        return null;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  



  /**
   * Get All Proposals ... With Filters
   * @@params No Params
   * @returns Array of Proposals and Total Number of Proposals
   */
  async index(filterDto: FilterProposalInput): Promise<GetAllProposals> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.proposalRepo.find({
          where: {
            id: Like(`%${rest.id}%`),
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.proposalRepo.count({
          where: {
            id: Like(`%${rest.id}%`),
          },
        }),
      ]);
      console.log(items);
      return { items, total };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
