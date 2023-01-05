import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateStudentInput } from './dto/create-student.input';
import { FilterStudentDto } from './dto/filter.students.dto';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './entities/students.entity';
import { ContributionsService } from './contributions.service';
import { CreateUpdateContributionInput } from './dto/nestedObjects/create-contribution.input';

@Resolver()
export class ContributionsResolver extends BaseProvider<Student> {
  constructor(private readonly contributionService: ContributionsService) {
    super();
  }
  /**
   * Create Contribution
   * @param createContributionsInput
   * @returns Contributions
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, { name: 'CreateContribution' })
  async create(
    @Args('CreateStudentInput')
    createContributionsInput: CreateUpdateContributionInput,
  ): Promise<Student> {
    try {
      return await this.contributionService.createUpdate(
        createContributionsInput,
      );
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
  // @Mutation(() => Student, {
  //   name: 'DeleteStudent',
  //   nullable: true,
  //   defaultValue: {},
  // })
  // async delete(
  //   @Args('DeleteStudentInput') deleteStudentInput: DeleteContributionsInput,
  // ): Promise<void> {
  //   try {
  //     return await this.contributionService.delete(deleteStudentInput);
  //   } catch (error) {}
  // }

  /**
   * Update Student Status
   * @param updateStudentStatus
   * @returns Updated Student
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, { name: 'UpdateStudent' })
  async edit(
    @Args('UpdateStudentInput')
    updateStudentStatus: CreateUpdateContributionInput,
  ): Promise<Student> {
    try {
      return await this.contributionService.update(updateStudentStatus);
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
  @Query(() => Student, { name: 'GetStudentDataByUserId', nullable: true })
  async show(@Args('studentId') id: string): Promise<Student> {
    try {
      return await this.contributionService.show(id);
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
  // @Query(() => GetAllContributions, {
  //   name: 'GetAllContributions',
  // })
  // async index(
  //   @Args('filterStudentDto', { nullable: true, defaultValue: {} })
  //   filterStudentDto: FilterStudentDto,
  // ): Promise<GetAllContributions> {
  //   try {
  //     // return await this.contributionService.index(filterStudentDto);
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }
}
