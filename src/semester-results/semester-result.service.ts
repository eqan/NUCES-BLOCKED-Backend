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
import { semesterStoreAddress } from 'src/contracts/deployedAddresses';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import ABI from '../contracts/SemesterStore.json';

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
    console.log(ABI);
    let from = Number(await this.redis.get('paginationFrom')) || 0;
    let to = Number(await this.redis.get('paginationTo')) || 90000;
    if (!from) {
      from = 0;
      await this.redis.set('paginationFrom', from);
    }
    if (!to) {
      to = 9;
      await this.redis.set('paginationTo', to);
    }

    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const contract = new Contract(semesterStoreAddress, ABI, provider);

    const semesters = await contract.functions.getAllSemestersWithPagination(
      from,
      to,
    );
    for (const semester of semesters) {
      await this.semesterRepo.save(semester);
    }
    if (semesters.length === 0) {
      this.logger.debug('No more semesters to fetch');
      this.schedulerRegistry.deleteCronJob('*/30 * * * * *');
    } else {
      this.logger.debug(`Fetched ${semesters.length} semesters`);
      from = to + 1;
      to = to + 10;
      await this.redis.set('paginationFrom', from);
      await this.redis.set('paginationTo', to);
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
