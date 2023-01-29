import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Student } from 'src/students/entities/students.entity';
import { GetAllStudents } from 'src/students/dto/get-all-students.dto';
import { ContributionDto, ContributionTypeInput } from './dto/contribution.dto';
import { FilterStudentDto } from 'src/students/dto/filter.students.dto';
import { ContributionsService } from './contributions.service';
import { DeleteContributionInput } from './dto/delete-contribution.input';
import { GetContributionInput } from './dto/get-contribution.input';

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
   * Delete Student
   * @param deleteStudentInput
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
    deleteStudentInput: DeleteContributionInput,
  ): Promise<void> {
    try {
      return await this.contributionService.delete(deleteStudentInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Student By address
   * @param id
   * @returns Student
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
      console.log(contribution);
      return contribution;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Contributions
   * @param filterStudentDto
   * @returns Searched or all students
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllStudents, {
    name: 'GetAllContributions',
  })
  async index(
    @Args('filterStudentDto', { nullable: true, defaultValue: {} })
    filterStudentDto: FilterStudentDto,
  ): Promise<GetAllStudents> {
    try {
      return { items: [], total: 0 };
      // return await this.contributionService.index(filterStudentDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
