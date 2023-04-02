import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterResultInput } from './dto/filter.semester-result.dto';
import { In, Like, Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-semester-result.input';
import { GetAllResults } from './dto/get-all-semester-results.dto';
import { UpdateResultsInput } from './dto/update-semester-result.input';
import { SemesterResult } from './entities/semester-result.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { DeployedContracts } from 'src/contracts/deployedAddresses';
import * as ABI from '../contracts/SemesterStore.json';
import { CronJob } from 'cron';
import { BigNumber } from '@ethersproject/bignumber';

@Injectable()
export class SemesterResultService {
  private readonly logger = new Logger('Semester-DataFetch-Cron');
  private readonly jobName = 'fetch-semester-results-from-blockchain';
  private job: CronJob;

  constructor(
    @InjectRepository(SemesterResult)
    private semesterRepo: Repository<SemesterResult>,
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

  // Cron job implementation for automatically retrieving and storing data from blockchain into db
  async dataFetchingFromBlockchain() {
    try {
      const provider = new JsonRpcProvider(process.env.RPC_URL);
      const abiArray = ABI.abi as any[];
      const contract = new Contract(
        DeployedContracts.SemesterStore,
        abiArray,
        provider,
      );

      const dataCountLocal = await this.semesterRepo.count();
      const dataCountBlockchain: number = (
        await contract.functions.getSemesterCount()
      )[0].toNumber();
      if (dataCountLocal < dataCountBlockchain) {
        const CHUNK_SIZE = 100;
        const fromSemesterIndex = Math.max(0, dataCountLocal - CHUNK_SIZE);
        let toSemesterIndex = dataCountLocal + CHUNK_SIZE;
        if (toSemesterIndex > dataCountBlockchain)
          toSemesterIndex = dataCountBlockchain;
        const semesters =
          await contract.functions.getAllSemestersWithPagination(
            fromSemesterIndex,
            toSemesterIndex,
            { from: process.env.CONTRACT_OWNER },
          );

        for (const semester of semesters[0]) {
          const semesterYear = BigNumber.from(semester['year']).toString();
          const data = {
            id: semester['semesterType'] + '_' + semester['year'].toNumber(),
            url: semester['url'],
            type: semester['semesterType'],
            year: semesterYear,
          };
          console.log(data);
          try {
            if (parseInt(semesterYear) != 0) {
              await this.semesterRepo.save(data);
            }
          } catch (error) {
            this.logger.error('Duplicate Data Found!');
          }
        }
        this.logger.verbose(
          `Fetched ${toSemesterIndex - fromSemesterIndex} semesters`,
        );
      } else {
        this.logger.log('No more semesters to fetch!');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Create Result
   * @params createUse
   * @return Results
   */
  async create(createResultInput: CreateResultDto): Promise<SemesterResult> {
    try {
      const { type, year, url } = createResultInput;
      const id = type + '_' + year;
      const result = this.semesterRepo.create({ id, type, year, url });
      await this.semesterRepo.save(result);
      const data = (await this.index({ id })).items[0];
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By Result Address
   * @param email
   * @returns userData
   */
  async show(id: string): Promise<SemesterResult> {
    try {
      const resultData = await this.semesterRepo.findOneBy({ id });
      if (!resultData) return null;
      return resultData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Results Attributes
   * @param updateResultsInput
   * @returns updated user
   */
  async update(
    updateResultsInput: UpdateResultsInput,
  ): Promise<SemesterResult> {
    try {
      const { id, url } = updateResultsInput;
      await this.semesterRepo.update({ id }, { url });
      return this.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Results
   * @param deleteResults
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.semesterRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Results ... With Filters
   * @@params No Params
   * @returns Array of Results and Total Number of Results
   */
  async index(filterDto: FilterResultInput): Promise<GetAllResults> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.semesterRepo.find({
          where: {
            id: Like(`%${rest.id}%`),
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.semesterRepo.count({
          where: {
            id: Like(`%${rest.id}%`),
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
