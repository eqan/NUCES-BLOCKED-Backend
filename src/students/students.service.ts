import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerCounsellorContributions } from 'src/contributions/entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from 'src/contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from 'src/contributions/entities/teacher.contribution.entity';
import { Certificate } from 'src/students-certificates/entities/certificates.entity';
import { In, Repository } from 'typeorm';
import { CreateStudentInput } from './dto/create-student.input';
import { FilterStudentDto } from './dto/filter.students.dto';
import { GetAllStudents } from './dto/get-all-students.dto';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './entities/students.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
    @InjectRepository(Certificate)
    private certificateRepo: Repository<Certificate>,
    @InjectRepository(TeachersContributions)
    private teachersRepo: Repository<TeachersContributions>,
    @InjectRepository(SocietyHeadsContributions)
    private societyRepo: Repository<SocietyHeadsContributions>,
    @InjectRepository(CareerCounsellorContributions)
    private counsellorRepo: Repository<CareerCounsellorContributions>,
  ) {}

  /**
   * Create Student
   * @params createUse
   * @return Students
   */
  async create(createStudentInput: CreateStudentInput) {
    try {
      await this.studentsRepo.save(createStudentInput);
      return this.show(createStudentInput.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By Student Address
   * @param email
   * @returns studentData
   */
  async show(id: string): Promise<Student> {
    try {
      const studentData = await this.studentsRepo.findOneBy({ id });
      if (!studentData) return null;
      return studentData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Students Attributes
   * @param updateStudentsInput
   * @returns updated student
   */
  async update(updateStudentsInput: UpdateStudentInput): Promise<Student> {
    try {
      await this.studentsRepo.save(updateStudentsInput);
      return this.show(updateStudentsInput.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Students
   * @param deleteStudents
   * @returns Message that student successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.certificateRepo.delete({ id: In(ids) });
      // await this.adminRepo.delete({ id: In(ids) });
      await this.counsellorRepo.delete({ studentId: In(ids) });
      await this.societyRepo.delete({ studentId: In(ids) });
      await this.teachersRepo.delete({ studentId: In(ids) });
      await this.studentsRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
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
      const query = this.studentsRepo
        .createQueryBuilder('student')
        .where(
          'student.name LIKE :name OR student.email LIKE :email OR student.id LIKE :id',
          {
            name: `%${rest.id}%`,
            email: `%${rest.id}%`,
            id: `%${rest.id}%`,
          },
        )
        .skip((page - 1) * limit || 0)
        .take(limit || 10);

      return {
        items: await query.getMany(),
        total: await query.getCount(),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
