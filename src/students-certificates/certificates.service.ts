import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterCertificateInput } from './dto/filter.certificates.dto';
import { In, Repository } from 'typeorm';
import { CreateCertificateDto } from './dto/create-certificate.input';
import { GetAllCertificates } from './dto/get-all-certificates.dto';
import { UpdateCertificatesInput } from './dto/update-certificates.input';
import { Certificate } from './entities/certificates.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepo: Repository<Certificate>,
  ) {}

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
      const { id, studentId, ...rest } = updateCertificatesInput;
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
            studentId: rest?.studentId,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.certificateRepo.count({
          where: {
            id: rest?.id,
            studentId: rest?.studentId,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
