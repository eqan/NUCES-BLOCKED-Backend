import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemErrors } from 'src/constants/errors.enum';
import { In, Repository } from 'typeorm';
import { CreateStudentInput } from './dto/create-student.input';
import { FilterStudentDto } from './dto/filter.students.dto';
import { GetAllStudents } from './dto/get-all-students.dto';
import { UpdateStudentInput } from './dto/update-student.input';
import { Students } from './entities/students.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students)
    private studentsRepo: Repository<Students>,
  ) {}

  /**
   * Create Student
   * @params createUse
   * @return Students
   */
  async createStudent(createStudentInput: CreateStudentInput) {
    try {
      const user = this.studentsRepo.create(createStudentInput);
      return this.studentsRepo.save(user);
    } catch (error) {
      if (error.message == SystemErrors.USER_ALREADY_PRESENT)
        throw new BadRequestException(SystemErrors.USER_ALREADY_PRESENT);
      throw new BadRequestException(SystemErrors.CREATE_USER);
    }
  }

  /**
   * Get Data By Student Address
   * @param email
   * @returns userData
   */
  async findOneById(id: string): Promise<Students> {
    try {
      const userData = await this.studentsRepo.findOneBy({ id });
      if (!userData) return null;
      return userData;
    } catch (error) {
      throw new BadRequestException({
        message: SystemErrors.GET_USER_DATA_BY_ID,
      });
    }
  }

  /**
   * Update Students Attributes
   * @param updateStudentsInput
   * @returns updated user
   */
  async updateStudent(
    updateStudentsInput: UpdateStudentInput,
  ): Promise<Students> {
    try {
      const { id, ...rest } = updateStudentsInput;
      await this.studentsRepo.update({ id }, rest);
      return this.findOneById(id);
    } catch (error) {
      throw new BadRequestException(SystemErrors.UPDATE_USER);
    }
  }

  /**
   * DELETE Students
   * @param deleteStudents
   * @returns Message that user successfully deleted
   */
  async deleteStudents(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.studentsRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(SystemErrors.DELETE_USER);
    }
  }

  /**
   * Get All Students ... With Filters
   * @@params No Params
   * @returns Array of Students and Total Number of Students
   */
  async findAllStudents(filterDto: FilterStudentDto): Promise<GetAllStudents> {
    try {
      const { page = 1, limit = 10, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.studentsRepo.find({
          where: {
            id: rest?.id,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.studentsRepo.count({
          where: {
            id: rest.id,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(SystemErrors.FIND_USERS);
    }
  }
}
