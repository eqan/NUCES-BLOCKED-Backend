import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { DeployedContracts } from 'src/contracts/deployedAddresses';
import { Student } from 'src/students/entities/students.entity';
import { In, Repository } from 'typeorm';
import * as ABI from '../contracts/CertificateStore.json';
import { CreateCertificateDto } from './dto/create-certificate.input';
import { FilterCertificateInput } from './dto/filter.certificates.dto';
import { GetAllCertificates } from './dto/get-all-certificates.dto';
import { UpdateCertificatesInput } from './dto/update-certificates.input';
import { Certificate } from './entities/certificates.entity';
import { EligibilityStatusEnum } from 'src/students/entities/enums/status.enum';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger('Certificate-DataFetch-Cron');
  private readonly jobName = 'fetch-certificates-from-blockchain';
  private job: CronJob;
  constructor(
    @InjectRepository(Certificate)
    private certificateRepo: Repository<Certificate>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
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
        DeployedContracts.CertificateStore,
        abiArray,
        provider,
      );

      const dataCountLocal = await this.certificateRepo.count();
      const dataCountBlockchain = (
        await contract.functions.getCertificateCount()
      )[0].toNumber();
      if (dataCountLocal < dataCountBlockchain) {
        const CHUNK_SIZE = 100;
        const fromCertificateIndex = Math.max(0, dataCountLocal - CHUNK_SIZE);
        let toCertificateIndex = dataCountLocal + CHUNK_SIZE;
        if (toCertificateIndex > dataCountBlockchain)
          toCertificateIndex = dataCountBlockchain;
        const certificates =
          await contract.functions.getCertificatesWithPagination(
            fromCertificateIndex,
            toCertificateIndex,
            { from: process.env.CONTRACT_OWNER },
          );
        for (const certificate of certificates[0]) {
          const data = {
            id: certificate['id'],
            name: certificate['name'],
            email: certificate['email'],
            url: certificate['url'],
            batch: certificate['batch'],
            cgpa: certificate['cgpa'],
            honours: certificate['honours'],
          };
          console.log(data);
          try {
            if (data.id != '') {
              this.studentsRepo.create({
                id: data.id,
                name: data.name,
                email: data.email,
                cgpa: data.cgpa,
                batch: data.batch,
                honours: data.honours,
                eligibilityStatus: EligibilityStatusEnum.ALREADY_PUBLISHED,
              });
            }
            try {
              await this.certificateRepo.save({ id: data.id, url: data.url });
            } catch (error) {
              this.logger.error('Duplicate Certificate Data Found!');
            }
          } catch (error) {
            this.logger.error('Duplicate Student Data Found!');
          }
        }

        this.logger.verbose(
          `Fetched ${toCertificateIndex - fromCertificateIndex} certificates`,
        );
      } else {
        this.logger.log('No more certificates to fetch!');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Update students who are in progress to already published
   */
  async updateInProgressStudentsToAlreadyPublished(): Promise<void> {
    try {
      await this.studentsRepo.update(
        { eligibilityStatus: EligibilityStatusEnum.IN_PROGRESS },
        { eligibilityStatus: EligibilityStatusEnum.ALREADY_PUBLISHED },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Create Certificate in Batches
   * @params createrCertificateInputs
   * @return boolean
   */
  async createInBatches(
    createCertificateInputs: CreateCertificateDto[],
  ): Promise<boolean> {
    try {
      const certificates = createCertificateInputs.map((input) =>
        this.certificateRepo.create(input),
      );
      await this.certificateRepo.insert(certificates);
      await this.updateInProgressStudentsToAlreadyPublished();
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Create Certificate
   * @params createUse
   * @return Certificates
   */
  async create(
    createCertificateInput: CreateCertificateDto,
  ): Promise<Certificate> {
    try {
      const certificate = this.certificateRepo.create(createCertificateInput);
      await this.certificateRepo.save(certificate);
      const data = (await this.index({ id: createCertificateInput.id }))
        .items[0];
      await this.studentsRepo.update(
        {
          id: createCertificateInput.id,
        },
        { eligibilityStatus: EligibilityStatusEnum.ALREADY_PUBLISHED },
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By Certificate Address
   * @param email
   * @returns userData
   */
  async show(id: string): Promise<Certificate> {
    try {
      const certificateData = await this.certificateRepo.findOneBy({ id });
      if (!certificateData) return null;
      return certificateData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Certificates Attributes
   * @param updateCertificatesInput
   * @returns updated user
   */
  async update(
    updateCertificatesInput: UpdateCertificatesInput,
  ): Promise<Certificate> {
    try {
      const { id, ...rest } = updateCertificatesInput;
      await this.certificateRepo.update({ id }, rest);
      const data = (await this.index({ id: updateCertificatesInput.id }))
        .items[0];
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Certificates
   * @param deleteCertificates
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.certificateRepo.delete({ id: In(ids) });
      await this.studentsRepo.update(
        {
          id: In(ids),
        },
        { eligibilityStatus: EligibilityStatusEnum.ELIGIBLE },
      );
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  /**
   * Get All Certificates ... With Filters
   * @@params No Params
   * @returns Array of Certificates and Total Number of Certificates
   */
  async index(filterDto: FilterCertificateInput): Promise<GetAllCertificates> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      const query = this.certificateRepo
        .createQueryBuilder('certificate')
        .leftJoinAndSelect('certificate.student', 'student')
        .where('certificate.id LIKE :id OR student.name LIKE :name', {
          id: `%${rest.id}%`,
          name: `%${rest.id}%`,
        })
        .skip((page - 1) * limit || 0)
        .take(limit || 10);

      return {
        items: await query.getMany(),
        total: await query.getCount(),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
