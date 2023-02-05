import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterResult } from './entities/semester-result.entity';
import { RedisService } from 'nestjs-redis';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { CronJob } from 'cron';
import * as fs from 'fs';
import { semesterStoreAddress } from 'src/contracts/deployedAddresses';

@Injectable()
export class SemesterCron {
  private readonly logger = new Logger(SemesterCron.name);
  private semesterABI: any;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(SemesterResult)
    private readonly semesterRepository: Repository<SemesterResult>,
    private readonly redisService: RedisService,
  ) {
    this.semesterABI = JSON.parse(
      fs.readFileSync(
        '../contracts/SemesterResult.sol/SemesterStore.json',
        'utf-8',
      ),
    );
  }

  async startCron() {
    const redisClient = this.redisService.getClient();

    const cronJob = new CronJob('*/30 * * * * *', async () => {
      let from = await redisClient.get('paginationFrom');
      let to = await redisClient.get('paginationTo');
      if (!from) {
        from = '0';
        await redisClient.set('paginationFrom', from);
      }
      if (!to) {
        to = '9';
        await redisClient.set('paginationTo', to);
      }

      const provider = new JsonRpcProvider(process.env.RPC_URL);
      const contract = new Contract(
        semesterStoreAddress,
        this.semesterABI,
        provider,
      );

      const semesters = await contract.functions.getAllSemestersWithPagination(
        from,
        to,
      );
      for (const semester of semesters) {
        await this.semesterRepository.save(semester);
      }
      if (semesters.length === 0) {
        this.logger.debug('No more semesters to fetch');
        this.schedulerRegistry.deleteCronJob('*/30 * * * * *');
      } else {
        this.logger.debug(`Fetched ${semesters.length} semesters`);
        from = to + 1;
        to = to + 10;
        await redisClient.set('paginationFrom', from);
        await redisClient.set('paginationTo', to);
      }
    });
    this.schedulerRegistry.addCronJob('SemesterCron', cronJob);
  }
}
