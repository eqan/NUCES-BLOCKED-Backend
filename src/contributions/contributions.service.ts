import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toNumber } from 'lodash';
import { ContributionTypeEnum } from 'src/contributions/entities/enums/contributions.enum';
import { AdminContributions } from 'src/contributions/entities/admin.contribution.entity';
import { CareerCounsellorContributions } from 'src/contributions/entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from 'src/contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from 'src/contributions/entities/teacher.contribution.entity';
import { Student } from 'src/students/entities/students.entity';
import { Repository } from 'typeorm';
import { ContributionDto, ContributionInput } from './dto/contribution.dto';
import { DeleteContributionInput } from './dto/delete-contribution.input';
import { GetContributionInput } from './dto/get-contribution.input';
import { GetAllContributions } from './dto/get-all-contributions.dto';
import { FilterAllContributionDto } from './dto/filter-contributions.input';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(AdminContributions)
    private adminRepo: Repository<AdminContributions>,
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
        case ContributionTypeEnum.ADMIN:
          contribution = this.adminRepo.create({
            id: rest.studentId,
            contribution: toNumber(rest.contribution),
            contributor: rest.contributor,
            adminContributionType: contributionType.adminContributionType,
          });
          return await this.adminRepo.save(contribution);
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
    try {
      const { contributionId, contributionType, studentId, contributor } =
        getContributionInput;
      switch (contributionType) {
        case ContributionTypeEnum.ADMIN:
          studentInfo.AdminContributions = await this.adminRepo.findOneByOrFail(
            {
              id: studentId,
              contributor,
            },
          );
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
          studentInfo.CareerCounsellorContributions[0] =
            await this.counsellorRepo.findOneByOrFail({
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
        case ContributionTypeEnum.ADMIN:
          this.adminRepo.delete({ id: studentId });
          break;
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
      let [items, total]: [any, number] = [null, 0];
      switch (rest.contributionType) {
        case ContributionTypeEnum.ADMIN:
          [items, total] = await Promise.all([
            this.adminRepo.find({
              where: {
                id: rest.studentId,
              },
              relations: { student: true },
              skip: (page - 1) * limit || 0,
              take: limit || 10,
            }),
            this.adminRepo.count({
              where: {
                id: rest.studentId,
              },
            }),
          ]);
          return { adminContributions: items, total };
        case ContributionTypeEnum.SOCIETY_HEAD:
          [items, total] = await Promise.all([
            this.societyRepo.find({
              where: {
                studentId: rest.studentId,
                contributor: rest.contributor,
              },
              relations: { student: true },
              skip: (page - 1) * limit || 0,
              take: limit || 10,
            }),
            this.societyRepo.count({
              where: {
                studentId: rest.studentId,
                contributor: rest.contributor,
              },
            }),
          ]);
          return { societyHeadsContributions: items, total };
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          [items, total] = await Promise.all([
            this.counsellorRepo.find({
              where: {
                studentId: rest.studentId,
                contributor: rest.contributor,
              },
              relations: { student: true },
              skip: (page - 1) * limit || 0,
              take: limit || 10,
            }),
            this.counsellorRepo.count({
              where: {
                studentId: rest.studentId,
                contributor: rest.contributor,
              },
            }),
          ]);
          return { careerCounsellorContributions: items, total };
        case ContributionTypeEnum.TEACHER:
          [items, total] = await Promise.all([
            this.teachersRepo.find({
              where: {
                studentId: rest.studentId,
                contributor: rest.contributor,
              },
              relations: { student: true },
              skip: (page - 1) * limit || 0,
              take: limit || 10,
            }),
            this.teachersRepo.count({
              where: {
                studentId: rest.studentId,
                contributor: rest.contributor,
              },
            }),
          ]);
          return { teachersContribution: items, total };
        default:
          return { adminContributions: [], total: 0 };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
