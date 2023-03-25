import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerCounsellorContributions } from 'src/contributions/entities/careercounsellor.contribution.entity';
import { ContributionTypeEnum } from 'src/contributions/entities/enums/contributions.enum';
import { SocietyHeadsContributions } from 'src/contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from 'src/contributions/entities/teacher.contribution.entity';
import { Student } from 'src/students/entities/students.entity';
import { Repository } from 'typeorm';
import { ContributionDto } from './dto/contribution.dto';
import { DeleteContributionInput } from './dto/delete-contribution.input';
import { FilterAllContributionDto } from './dto/filter-contributions.input';
import { GetAllContributions } from './dto/get-all-contributions.dto';
import { GetContributionInput } from './dto/get-contribution.input';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(TeachersContributions)
    private teachersRepo: Repository<TeachersContributions>,
    @InjectRepository(SocietyHeadsContributions)
    private societyRepo: Repository<SocietyHeadsContributions>,
    @InjectRepository(CareerCounsellorContributions)
    private counsellorRepo: Repository<CareerCounsellorContributions>,
  ) {}

  /**
   * Create Contribution
   * @params createUse
   * @return Contributions
   */
  async createUpdate(contributionInput: ContributionDto): Promise<Student> {
    try {
      let contribution = null;
      const { contributionType, ...rest } = contributionInput;
      switch (contributionType.contributionType) {
        case ContributionTypeEnum.SOCIETY_HEAD:
          contribution = this.societyRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            title: rest.title,
            contributor: rest.contributor,
            societyHeadContributionType:
              contributionType.societyHeadContributionType,
          });
          return await this.societyRepo.save(contribution);
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          contribution = this.counsellorRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            title: rest.title,
            contributor: rest.contributor,
            careerCounsellorContributionType:
              contributionType.careerCounsellorContributionType,
          });
          return await this.counsellorRepo.save(contribution);
        case ContributionTypeEnum.TEACHER:
          contribution = this.teachersRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            title: rest.title,
            contributor: rest.contributor,
            teacherContributionType: contributionType.teacherContributionType,
          });
          return await this.teachersRepo.save(contribution);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By Contribution Address
   * @param email
   * @returns userData
   */
  async show(getContributionInput: GetContributionInput): Promise<Student> {
    const studentInfo = new Student();
    studentInfo.id = getContributionInput.studentId;
    studentInfo.SocietyHeadsContributions = [];
    studentInfo.CareerCounsellorContributions = [];
    studentInfo.TeachersContributions = [];
    try {
      const { contributionId, contributionType, studentId, contributor } =
        getContributionInput;
      switch (contributionType) {
        case ContributionTypeEnum.SOCIETY_HEAD:
          studentInfo.SocietyHeadsContributions[0] =
            await this.societyRepo.findOneByOrFail({
              id: contributionId,
              studentId,
              contributor,
            });
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          studentInfo.CareerCounsellorContributions[0] =
            await this.counsellorRepo.findOneByOrFail({
              id: contributionId,
              studentId,
              contributor,
            });
        case ContributionTypeEnum.TEACHER:
          studentInfo.TeachersContributions[0] =
            await this.teachersRepo.findOneByOrFail({
              id: contributionId,
              studentId,
              contributor,
            });
      }
      return studentInfo;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  /**
   * DELETE Contributions
   * @param deleteContributions
   * @returns Message that user successfully deleted
   */
  async delete(
    deleteContributionInput: DeleteContributionInput,
  ): Promise<void> {
    try {
      const { contributionId, contributionType, studentId } =
        deleteContributionInput;
      switch (contributionType) {
        case ContributionTypeEnum.SOCIETY_HEAD:
          this.societyRepo.delete({ studentId, id: contributionId });
          break;
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          this.counsellorRepo.delete({ studentId, id: contributionId });
          break;
        case ContributionTypeEnum.TEACHER:
          this.teachersRepo.delete({ studentId, id: contributionId });
          break;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
    return null;
  }

  /**
   * Get All Contributions ... With Filters
   * @@params No Params
   * @returns Array of Contributions and Total Number of Contributions
   */
  async index(
    filterDto: FilterAllContributionDto,
  ): Promise<GetAllContributions> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      let query = null;
      switch (rest.contributionType) {
        case ContributionTypeEnum.SOCIETY_HEAD:
          query = this.societyRepo
            .createQueryBuilder('society')
            .leftJoinAndSelect('society.student', 'student')
            .where(
              '(society.studentId LIKE :studentId OR student.name LIKE :name) AND society.contributor = :contributor',
              {
                studentId: `%${rest.studentId}%`,
                name: `%${rest.studentId}%`,
                contributor: rest.contributor,
              },
            )
            .skip((page - 1) * limit || 0)
            .take(limit || 10);
          return {
            societyHeadsContributions: await query.getMany(),
            total: await query.getCount(),
          };

        case ContributionTypeEnum.CAREER_COUNSELLOR:
          query = this.counsellorRepo
            .createQueryBuilder('careercounsellor')
            .leftJoinAndSelect('careercounsellor.student', 'student')
            .where(
              '(careercounsellor.studentId LIKE :studentId OR student.name LIKE :name) AND careercounsellor.contributor = :contributor',
              {
                studentId: `%${rest.studentId}%`,
                name: `%${rest.studentId}%`,
                contributor: rest.contributor,
              },
            )
            .skip((page - 1) * limit || 0)
            .take(limit || 10);

          return {
            careerCounsellorContributions: await query.getMany(),
            total: await query.getCount(),
          };

        case ContributionTypeEnum.TEACHER:
          query = this.teachersRepo
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.student', 'student')
            .where(
              '(teacher.studentId LIKE :studentId OR student.name LIKE :name) AND teacher.contributor = :contributor',
              {
                studentId: `%${rest.studentId}%`,
                name: `%${rest.studentId}%`,
                contributor: rest.contributor,
              },
            )
            .skip((page - 1) * limit || 0)
            .take(limit || 10);

          return {
            teachersContribution: await query.getMany(),
            total: await query.getCount(),
          };

        default:
          return { teachersContribution: [], total: 0 };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
