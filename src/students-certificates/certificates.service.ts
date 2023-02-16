import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterCertificateInput } from './dto/filter.certificates.dto';
import { In, Repository } from 'typeorm';
import { CreateCertificateDto } from './dto/create-certificate.input';
import { GetAllCertificates } from './dto/get-all-certificates.dto';
import { UpdateCertificatesInput } from './dto/update-certificates.input';
import { Certificate } from './entities/certificates.entity';
import { Cron } from '@nestjs/schedule';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { DeployedContracts } from 'src/contracts/deployedAddresses';
import { Student } from 'src/students/entities/students.entity';

const ABI = [
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
    name: 'CertificateOperation',
    type: 'event',
  },
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
    inputs: [
      {
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'email',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'url',
        type: 'string',
      },
    ],
    name: 'addCertificate',
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
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
    ],
    name: 'getCertificate',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
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
    name: 'getCertificateCount',
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
    name: 'getCertificatesWithPagination',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'id',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'email',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'url',
            type: 'string',
          },
        ],
        internalType: 'struct CertificateStore.Certificate[]',
        name: '',
        type: 'tuple[]',
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
    name: 'removeCertificate',
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
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'email',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'url',
        type: 'string',
      },
    ],
    name: 'updateCertificate',
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
export class CertificatesService {
  private readonly logger = new Logger('Certificate-DataFetch-Cron');
  constructor(
    @InjectRepository(Certificate)
    private certificateRepo: Repository<Certificate>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
  ) {}

  // Cron job implementation for automatically retrieving and storing data from blockchain into db
  @Cron('*/30 * * * * *')
  async dataFetchingFromBlockchain() {
    try {
      const provider = new JsonRpcProvider(process.env.RPC_URL);
      const contract = new Contract(
        DeployedContracts.CertificateStore,
        ABI,
        provider,
      );

      const dataCountLocal = await this.certificateRepo.count();
      const dataCountBlockchain = (
        await contract.functions.getCertificateCount()
      )[0].toNumber();
      if (dataCountLocal != dataCountBlockchain) {
        const CHUNK_SIZE = 10;
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
            await this.studentsRepo.save({
              id: data.id,
              name: data.name,
              email: data.email,
            });
            await this.certificateRepo.save({ id: data.id, url: data.url });
          } catch (error) {
            this.logger.error('Duplicate Data Found!');
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
      return this.certificateRepo.save(certificate);
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
      const [items, total] = await Promise.all([
        this.certificateRepo.find({
          where: {
            id: rest?.id,
            // studentId: rest?.studentId,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.certificateRepo.count({
          where: {
            id: rest?.id,
            // studentId: rest?.studentId,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
