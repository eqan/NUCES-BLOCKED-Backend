import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterResultInput } from './dto/filter.semester-result.dto';
import { In, Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-semester-result.input';
import { GetAllResults } from './dto/get-all-semester-results.dto';
import { UpdateResultsInput } from './dto/update-semester-result.input';
import { SemesterResult } from './entities/semester-result.entity';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { DeployedContracts } from 'src/contracts/deployedAddresses';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from '@ethersproject/bignumber';

const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'operation',
        type: 'string',
      },
    ],
    name: 'SemesterOperation',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'semesterType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'year',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'url',
        type: 'string',
      },
    ],
    name: 'addSemester',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'from',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'to',
        type: 'uint256',
      },
    ],
    name: 'getAllSemestersWithPagination',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'semesterType',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'year',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'url',
            type: 'string',
          },
        ],
        internalType: 'struct SemesterStore.Semester[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
    ],
    name: 'getSemester',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSemesterCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
    ],
    name: 'removeSemester',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'url',
        type: 'string',
      },
    ],
    name: 'updateSemester',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

@Injectable()
export class SemesterResultService {
  private readonly logger = new Logger('Semester-DataFetch-Cron');
  redis = new Redis(this.config.get('REDIS_URL'));

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(SemesterResult)
    private semesterRepo: Repository<SemesterResult>,
    private readonly config: ConfigService,
  ) {}

  @Cron('*/30 * * * * *')
  async dataFetchingFromBlockchain() {
    // console.log(ABI);
    try {
      let fromSemesterIndex = 0;
      let toSemesterIndex = 2;
      console.log(fromSemesterIndex);
      console.log(toSemesterIndex);
      if (!fromSemesterIndex) {
        fromSemesterIndex = 0;
        await this.redis.set('paginationFrom', fromSemesterIndex);
      }
      if (!toSemesterIndex) {
        toSemesterIndex = 9;
        await this.redis.set('paginationTo', toSemesterIndex);
      }

      const provider = new JsonRpcProvider(process.env.RPC_URL);
      const contract = new Contract(
        DeployedContracts.SemesterStore,
        ABI,
        provider,
      );

      const semesters = await contract.functions.getAllSemestersWithPagination(
        fromSemesterIndex,
        toSemesterIndex,
        { from: process.env.CONTRACT_OWNER },
      );
      for (const semester of semesters[0]) {
        const data = {
          id: semester['semesterType'] + '_' + semester['year'].toNumber(),
          url: semester['url'],
          type: semester['semesterType'],
          year: semester['year'].toNumber(),
        };
        console.log(data);
        try {
          if (data.year != 0) {
            await this.semesterRepo.save(data);
          }
        } catch (error) {
          this.logger.error('Duplicate Data Found!');
        }
      }
      if (semesters.length === 0) {
        this.logger.debug('No more semesters to fetch');
        this.schedulerRegistry.deleteCronJob('*/30 * * * * *');
      } else {
        this.logger.debug(`Fetched ${semesters.length} semesters`);
        fromSemesterIndex = toSemesterIndex + 1;
        toSemesterIndex = toSemesterIndex + 10;
        await this.redis.set('paginationFrom', fromSemesterIndex);
        await this.redis.set('paginationTo', toSemesterIndex);
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
      return this.semesterRepo.save(result);
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
            id: rest?.id,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.semesterRepo.count({
          where: {
            id: rest?.id,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
