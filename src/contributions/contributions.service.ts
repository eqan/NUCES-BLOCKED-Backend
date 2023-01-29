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
import { ContributionDto } from './dto/contribution.dto';
import { DeleteContributionInput } from './dto/delete-contribution.input';
import { GetContributionInput } from './dto/get-contribution.input';

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
            adminContributionType: contributionType.adminContributionType,
          });
          return await this.adminRepo.save(contribution);
        case ContributionTypeEnum.SOCIETY_HEAD:
          contribution = this.societyRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            societyHeadContributionType:
              contributionType.societyHeadContributionType,
          });
          return await this.societyRepo.save(contribution);
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          contribution = this.counsellorRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            careerCounsellorContributionType:
              contributionType.careerCounsellorContributionType,
          });
          return await this.counsellorRepo.save(contribution);
        case ContributionTypeEnum.TEACHER:
          contribution = this.teachersRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
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
      const { contributionId, contributionType, studentId } =
        getContributionInput;
      switch (contributionType) {
        case ContributionTypeEnum.ADMIN:
          studentInfo.AdminContributions = await this.adminRepo.findOneByOrFail(
            {
              id: studentId,
            },
          );
        case ContributionTypeEnum.SOCIETY_HEAD:
          studentInfo.SocietyHeadsContributions[0] =
            await this.societyRepo.findOneByOrFail({
              id: contributionId,
              studentId,
            });
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          studentInfo.CareerCounsellorContributions[0] =
            await this.counsellorRepo.findOneByOrFail({
              id: contributionId,
              studentId,
            });
        case ContributionTypeEnum.TEACHER:
          studentInfo.CareerCounsellorContributions[0] =
            await this.counsellorRepo.findOneByOrFail({
              id: contributionId,
              studentId,
            });
      }
      return studentInfo;
    } catch (error) {
      throw new BadRequestException(error);
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
  // async index(filterDto: FilterContributionDto): Promise<GetAllContributions> {
  //   try {
  //     const { page = 1, limit = 20, ...rest } = filterDto;
  //     const [items, total] = await Promise.all([
  //       this.contributionsRepo.find({
  //         where: {
  //           id: rest?.id,
  //         },
  //         skip: (page - 1) * limit || 0,
  //         take: limit || 10,
  //       }),
  //       this.contributionsRepo.count({
  //         where: {
  //           id: rest.id,
  //         },
  //       }),
  //     ]);
  //     return { items, total };
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }
}
