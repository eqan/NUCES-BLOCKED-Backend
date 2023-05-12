import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateStudentInput } from './dto/create-student.input';
import { DeleteStudentsInput } from './dto/delete-students.input';
import { FilterStudentDto } from './dto/filter.students.dto';
import { GetAllStudents } from './dto/get-all-students.dto';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './entities/students.entity';
import { StudentsService } from './students.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Resolver(() => Student)
export class StudentsResolver extends BaseProvider<Student> {
  constructor(private readonly studentService: StudentsService) {
    super();
  }

  /**
   * Cron job that runs every year and updates the elgibility of students
   * who are about to gradudate
   */
  @Cron(CronExpression.EVERY_YEAR)
  async automaticEligibilityStatusUpdatingCron() {
    try {
      await this.studentService.updateEligibilityStatusForAllStudents();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update students who are about to graduate to eligible
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => String, { name: 'UpdateEligibilityStatusForAllStudents' })
  async updateEligibilityStatusForAllStudents(): Promise<string> {
    try {
      await this.studentService.updateEligibilityStatusForAllStudents();
      return 'Students eligibity status updated!';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update students who are about to graduate to eligible
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    name: 'UpdateEligibleStudentsToInProgress',
    nullable: true,
  })
  async updateEligibleStudentsToInProgress(): Promise<void> {
    try {
      await this.studentService.updateEligibleStudentsToInprogress();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Create Student
   * @param createStudentsInput
   * @returns Students
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, { name: 'CreateStudent' })
  async create(
    @Args('CreateStudentInput') createStudentsInput: CreateStudentInput,
  ): Promise<Student> {
    try {
      return await this.studentService.create(createStudentsInput);
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
    name: 'DeleteStudent',
    nullable: true,
    defaultValue: {},
  })
  async delete(
    @Args('DeleteStudentInput') deleteStudentInput: DeleteStudentsInput,
  ): Promise<void> {
    try {
      return await this.studentService.delete(deleteStudentInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Student Status
   * @param updateStudentStatus
   * @returns Updated Student
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Student, { name: 'UpdateStudent' })
  async edit(
    @Args('UpdateStudentInput')
    updateStudentStatus: UpdateStudentInput,
  ): Promise<Student> {
    try {
      return await this.studentService.update(updateStudentStatus);
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
      return await this.studentService.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Students
   * @param filterStudentDto
   * @returns Searched or all students
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllStudents, {
    name: 'GetAllStudents',
  })
  async index(
    @Args('filterStudentDto', { nullable: true, defaultValue: {} })
    filterStudentDto: FilterStudentDto,
  ): Promise<GetAllStudents> {
    try {
      return await this.studentService.index(filterStudentDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
