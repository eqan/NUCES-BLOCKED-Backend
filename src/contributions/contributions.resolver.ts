import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Student } from 'src/students/entities/students.entity';
import { ContributionDto } from './dto/contribution.dto';
import { ContributionsService } from './contributions.service';
import { DeleteContributionInput } from './dto/delete-contribution.input';
import { GetContributionInput } from './dto/get-contribution.input';
import { FilterAllContributionDto } from './dto/filter-contributions.input';
import { GetAllContributions } from './dto/get-all-contributions.dto';
import { IndexContributionsOnStudentIdAndEligibilityInput } from './dto/get-contributions-oneligbility.input';
import { IndexAllContributionsForCVDTO } from './dto/get-all-contributions-for-resume.dto';

@Resolver()
export class ContributionsResolver {
  constructor(private readonly contributionService: ContributionsService) {}
  /**
   * Create Contribution
   * @param contributionDto
   * @returns Contributions
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, { name: 'CreateContribution', nullable: true })
  async create(
    @Args('CreateStudentInput')
    contributionDto: ContributionDto,
  ): Promise<Student> {
    try {
      return await this.contributionService.create(contributionDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Student, { name: 'UpdateContribution', nullable: true })
  async update(
    @Args('UpdateStudentInput')
    contributionDto: ContributionDto,
  ): Promise<Student> {
    try {
      return await this.contributionService.update(contributionDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  /**
   * Delete Contribution
   * @param deleteContributionInput
   * @returns void
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, {
    name: 'DeleteContribution',
    nullable: true,
    defaultValue: {},
  })
  async delete(
    @Args('DeleteContributionInput', { type: () => [DeleteContributionInput] })
    deleteContributionInputs: DeleteContributionInput[],
  ): Promise<void> {
    try {
      return await this.contributionService.delete(deleteContributionInputs);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Contribution By address
   * @param id
   * @returns Contribution
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => Student, { name: 'GetContribution', nullable: true })
  async show(
    @Args('GetContributionInput') getContributionInput: GetContributionInput,
  ): Promise<Student> {
    try {
      const contribution = await this.contributionService.show(
        getContributionInput,
      );
      return contribution;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Contributions
   * @param filterContributionsDto
   * @returns Searched for all Contribution
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllContributions, {
    name: 'GetAllContributions',
  })
  async index(
    @Args('FilterContributionsDto', { nullable: true, defaultValue: {} })
    filterContributionsDto: FilterAllContributionDto,
  ): Promise<GetAllContributions | null> {
    try {
      const contribution = await this.contributionService.index(
        filterContributionsDto,
      );
      return contribution;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Index All Contributions For Resume
   * @param studentId
   * @returns Searched for all Contribution
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => IndexAllContributionsForCVDTO, {
    name: 'IndexAllContributionsOnCriteria',
    nullable: true,
  })
  async indexAllContributionsForCV(
    @Args('IndexAllContributionsDto')
    indexInputDto: IndexContributionsOnStudentIdAndEligibilityInput,
  ): Promise<any> {
    try {
      const contributions =
        await this.contributionService.indexStudentDataForCV(indexInputDto);
      const dto = new IndexAllContributionsForCVDTO();
      dto.careerCounsellorContributions = contributions[1];
      dto.societyHeadsContributions = contributions[0];
      dto.teachersContribution = contributions[2];
      return dto;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
