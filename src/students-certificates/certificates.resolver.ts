import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateCertificateInput } from './dto/create-certificate.input';
import { DeleteCertificatesInput } from './dto/delete-certificates.input';
import { FilterCertificateInput } from './dto/filter.certificates.dto';
import { GetAllCertificates } from './dto/get-all-certificates.dto';
import { UpdateCertificatesInput } from './dto/update-certificates.input';
import { Certificates } from './entities/certificates.entity';
import { CertificatesService } from './certificates.service';

@Resolver()
export class CertificatessResolver extends BaseProvider<Certificates> {
  constructor(private readonly certificateService: CertificatesService) {
    super();
  }
  /**
   * Create Certificate
   * @param createCertificatesInput
   * @returns Certificates
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Certificates, { name: 'CreateCertificate' })
  async create(
    @Args('CreateCertificateInput')
    createCertificatesInput: CreateCertificateInput,
  ): Promise<Certificates> {
    try {
      return await this.certificateService.create(createCertificatesInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Certificate
   * @param deleteCertificateInput
   * @returns void
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Certificates, { name: 'DeleteCertificate' })
  async delete(
    @Args('DeleteCertificateInput', { nullable: true })
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
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Certificates, { name: 'UpdateCertificate' })
  async edit(
    @Args('UpdateCertificateInput')
    updateCertificateStatus: UpdateCertificatesInput,
  ): Promise<Certificates> {
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
  @UseGuards(JwtAuthGuard)
  @Query(() => Certificates, {
    name: 'GetCertificateDataByCertificateEmail',
    nullable: true,
  })
  async show(@Args('userEmail') id: string): Promise<Certificates> {
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
  @UseGuards(JwtAuthGuard)
  @Query(() => GetAllCertificates, {
    name: 'GetAllCertificates',
  })
  async index(
    @Args('filterCertificateDto', { nullable: true, defaultValue: {} })
    filterCertificateDto: FilterCertificateInput,
  ): Promise<GetAllCertificates> {
    try {
      return await this.certificateService.index(filterCertificateDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
