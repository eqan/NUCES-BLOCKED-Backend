import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DeployedContracts } from 'src/contracts/deployedAddresses';
import { Student } from 'src/students/entities/students.entity';
import { In, Repository } from 'typeorm';
import * as ABI from '../contracts/CertificateStore.json';
import { CreateCertificateDto } from './dto/create-certificate.input';
import { FilterCertificateInput } from './dto/filter.certificates.dto';
import { GetAllCertificates } from './dto/get-all-certificates.dto';
import { UpdateCertificatesInput } from './dto/update-certificates.input';
import { Certificate } from './entities/certificates.entity';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger('Certificate-DataFetch-Cron');
  constructor(
    @InjectRepository(Certificate)
    private certificateRepo: Repository<Certificate>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
  ) {}

  // Cron job implementation for automatically retrieving and storing data from blockchain into db
  @Cron('*/1000 * * * * *')
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
          };
          console.log(data);
          try {
            if (data.id != '') {
              await this.studentsRepo.save({
                id: data.id,
                name: data.name,
                email: data.email,
                cgpa: 0,
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
      return this.show(id);
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
