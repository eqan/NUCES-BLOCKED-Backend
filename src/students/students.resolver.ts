import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateStudentInput } from './dto/create-student.input';
import { DeleteStudentsInput } from './dto/delete-students.input';
import { FilterStudentDto } from './dto/filter.students.dto';
import { GetAllStudents } from './dto/get-all-students.dto';
import { UpdateStudentInput } from './dto/update-student.input';
import { Students } from './entities/students.entity';
import { StudentsService } from './students.service';

@Resolver()
export class StudentsResolver extends BaseProvider<Students> {
  constructor(private readonly studentService: StudentsService) {
    super();
  }
  /**
   * Create Student
   * @param createStudentsInput
   * @returns Students
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Students, { name: 'CreateStudent' })
  async create(
    @Args('CreateStudentInput') createStudentsInput: CreateStudentInput,
  ): Promise<Students> {
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
  @Mutation(() => Students, { name: 'DeleteStudent', nullable: true })
  async delete(
    @Args('DeleteStudentInput') deleteStudentInput: DeleteStudentsInput,
  ): Promise<void> {
    try {
      return await this.studentService.delete(deleteStudentInput);
    } catch (error) {}
  }

  /**
   * Update Student Status
   * @param updateStudentStatus
   * @returns Updated Student
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Students, { name: 'UpdateStudent' })
  async edit(
    @Args('UpdateStudentInput')
    updateStudentStatus: UpdateStudentInput,
  ): Promise<Students> {
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
  @Query(() => Students, { name: 'GetStudentDataByuserId', nullable: true })
  async show(@Args('studentId') id: string): Promise<Students> {
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
