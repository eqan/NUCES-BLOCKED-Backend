import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  async create(createStudentInput: CreateStudentInput) {
    try {
      const user = this.studentsRepo.create(createStudentInput);
      return this.studentsRepo.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By Student Address
   * @param email
   * @returns userData
   */
  async show(id: string): Promise<Students> {
    try {
      const userData = await this.studentsRepo.findOneBy({ id });
      if (!userData) return null;
      return userData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Students Attributes
   * @param updateStudentsInput
   * @returns updated user
   */
  async update(updateStudentsInput: UpdateStudentInput): Promise<Students> {
    try {
      const { id, ...rest } = updateStudentsInput;
      await this.studentsRepo.update({ id }, rest);
      return this.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Students
   * @param deleteStudents
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.studentsRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Students ... With Filters
   * @@params No Params
   * @returns Array of Students and Total Number of Students
   */
  async index(filterDto: FilterStudentDto): Promise<GetAllStudents> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
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
      throw new BadRequestException(error);
    }
  }
}
