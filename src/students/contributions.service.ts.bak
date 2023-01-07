import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUpdateContributionInput } from './dto/nestedObjects/create-contribution.input';
import { Student } from './entities/students.entity';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Student)
    private contributionsRepo: Repository<Student>,
  ) {}

  /**
   * Create Contribution
   * @params createUse
   * @return Contributions
   */
  async createUpdate(createContributionInput: CreateUpdateContributionInput) {
    try {
      const contribution = this.contributionsRepo.create(
        createContributionInput,
      );
      return this.contributionsRepo.save(contribution);
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
    try {
      const userData = await this.contributionsRepo.findOneBy({ id });
      if (!userData) return null;
      return userData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Contributions Attributes
   * @param updateContributionsInput
   * @returns updated user
   */
  async update(
    updateContributionsInput: CreateUpdateContributionInput,
  ): Promise<Student> {
    const { id, ...rest } = updateContributionsInput;
    const student = await this.contributionsRepo.findOneBy({ id });
    if (!student) {
      throw new NotFoundException(`Student with ID "${id}" not found`);
    }
    // Update the student entity using the dto
    this.contributionsRepo.merge(student, updateContributionsInput);
    return this.contributionsRepo.save(student);
  }

  /**
   * DELETE Contributions
   * @param deleteContributions
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.contributionsRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException(error);
    }
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
