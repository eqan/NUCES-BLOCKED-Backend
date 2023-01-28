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
import { In, Repository } from 'typeorm';
import { ContributionDto } from './dto/contribution.dto';

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
  async createUpdate(contributionInput: ContributionDto) {
    try {
      let contribution = null;
      const { assetType, ...rest } = contributionInput;
      switch (assetType.assetClass) {
        case ContributionTypeEnum.ADMIN:
          contribution = this.adminRepo.create({
            id: rest.studentId,
            contribution: toNumber(rest.contribution),
            adminContributionType: assetType.adminContributionType,
          });
          return this.adminRepo.save(contribution);
        case ContributionTypeEnum.SOCIETY_HEAD:
          contribution = this.societyRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            societyHeadContributionType: assetType.societyHeadContributionType,
          });
          return this.societyRepo.save(contribution);
        case ContributionTypeEnum.CAREER_COUNSELLOR:
          contribution = this.counsellorRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            careerCounsellorContributionType:
              assetType.careerCounsellorContributionType,
          });
          return this.counsellorRepo.save(contribution);
        case ContributionTypeEnum.TEACHER:
          contribution = this.teachersRepo.create({
            studentId: rest.studentId,
            contribution: rest.contribution,
            teacherContributionType: assetType.teacherContribution,
          });
          return this.teachersRepo.save(contribution);
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
  async show(id: string): Promise<Student> {
    return new Student();
    // try {

    //   const userData = await this.adminRepo.findOneBy({ id });
    //   if (!userData) return null;
    //   return userData;
    // } catch (error) {
    //   throw new BadRequestException(error);
    // }
  }

  /**
   * Update Contributions Attributes
   * @param updateContributionsInput
   * @returns updated user
   */
  /**
   * DELETE Contributions
   * @param deleteContributions
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    return null;
    // // return new Student();
    // try {
    //   const ids = deleteWithIds.id;
    //   await this.adminRepo.delete({ id: In(ids) });
    //   return null;
    // } catch (error) {
    //   // console.log(error);
    //   throw new BadRequestException(error);
    // }
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
