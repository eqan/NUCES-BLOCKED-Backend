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

@Resolver()
export class ContributionsResolver {
  constructor(private readonly contributionService: ContributionsService) {}
  /**
   * Create Contribution
   * @param contributionDto
   * @returns Contributions
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, { name: 'CreateUpdateContribution' })
  async create(
    @Args('CreateUpdateStudentInput')
    contributionDto: ContributionDto,
  ): Promise<Student> {
    try {
      return await this.contributionService.createUpdate(contributionDto);
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
    @Args('DeleteContributionInput')
    deleteContributionInput: DeleteContributionInput,
  ): Promise<void> {
    try {
      return await this.contributionService.delete(deleteContributionInput);
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
   * @returns Searched or all Contribution
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllContributions, {
    name: 'GetAllContributions',
  })
  async index(
    @Args('FilterContributionsDto', { nullable: true, defaultValue: {} })
    filterContributionsDto: FilterAllContributionDto,
  ): Promise<GetAllContributions> {
    try {
      const contribution = await this.contributionService.index(
        filterContributionsDto,
      );
      // console.log(contribution);
      return contribution;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
