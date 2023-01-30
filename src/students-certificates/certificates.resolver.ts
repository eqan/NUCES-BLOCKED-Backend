import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateCertificateDto } from './dto/create-certificate.input';
import { DeleteCertificatesInput } from './dto/delete-certificates.input';
import { FilterCertificateInput } from './dto/filter.certificates.dto';
import { GetAllCertificates } from './dto/get-all-certificates.dto';
import { UpdateCertificatesInput } from './dto/update-certificates.input';
import { Certificate } from './entities/certificates.entity';
import { CertificatesService } from './certificates.service';

@Resolver()
export class CertificatessResolver extends BaseProvider<Certificate> {
  constructor(private readonly certificateService: CertificatesService) {
    super();
  }
  /**
   * Create Certificate
   * @param createCertificateInput
   * @returns Certificates
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Certificate, { name: 'CreateCertificate' })
  async create(
    @Args('CreateCertificateInput')
    createCertificateInput: CreateCertificateDto,
  ): Promise<Certificate> {
    try {
      return await this.certificateService.create(createCertificateInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Certificate
   * @param deleteCertificateInput
   * @returns void
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Certificate, { name: 'DeleteCertificate', nullable: true })
  async delete(
    @Args('DeleteCertificateInput')
    deleteCertificateInput: DeleteCertificatesInput,
  ): Promise<void> {
    try {
      await this.certificateService.delete(deleteCertificateInput);
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Certificate Status
   * @param updateCertificateStatus
   * @returns Updated Certificate
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Certificate, { name: 'UpdateCertificate' })
  async edit(
    @Args('UpdateCertificateInput')
    updateCertificateStatus: UpdateCertificatesInput,
  ): Promise<Certificate> {
    try {
      return await this.certificateService.update(updateCertificateStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Certificate By address
   * @param id
   * @returns Certificate
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => Certificate, {
    name: 'GetCertificateByRollNumber',
    nullable: true,
  })
  async show(@Args('id') id: string): Promise<Certificate> {
    try {
      return await this.certificateService.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Certificates
   * @param filterCertificateDto
   * @returns Searched or all users
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllCertificates, {
    name: 'GetAllCertificates',
  })
  async index(
    @Args('FilterCertificateInput', { nullable: true, defaultValue: {} })
    filterCertificateDto: FilterCertificateInput,
  ): Promise<GetAllCertificates> {
    try {
      return await this.certificateService.index(filterCertificateDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
