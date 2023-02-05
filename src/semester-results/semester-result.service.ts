import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterResultInput } from './dto/filter.semester-result.dto';
import { In, Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-semester-result.input';
import { GetAllResults } from './dto/get-all-semester-results.dto';
import { UpdateResultsInput } from './dto/update-semester-result.input';
import { SemesterResult } from './entities/semester-result.entity';

@Injectable()
export class SemesterResultService {
  constructor(
    @InjectRepository(SemesterResult)
    private resultRepo: Repository<SemesterResult>,
  ) {}

  /**
   * Create Result
   * @params createUse
   * @return Results
   */
  async create(createResultInput: CreateResultDto): Promise<SemesterResult> {
    try {
      const { type, year, url } = createResultInput;
      const id = type + '_' + year;
      const result = this.resultRepo.create({ id, type, year, url });
      return this.resultRepo.save(result);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By Result Address
   * @param email
   * @returns userData
   */
  async show(id: string): Promise<SemesterResult> {
    try {
      const resultData = await this.resultRepo.findOneBy({ id });
      if (!resultData) return null;
      return resultData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Results Attributes
   * @param updateResultsInput
   * @returns updated user
   */
  async update(
    updateResultsInput: UpdateResultsInput,
  ): Promise<SemesterResult> {
    try {
      const { id, url } = updateResultsInput;
      await this.resultRepo.update({ id }, { url });
      return this.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Results
   * @param deleteResults
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.resultRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Results ... With Filters
   * @@params No Params
   * @returns Array of Results and Total Number of Results
   */
  async index(filterDto: FilterResultInput): Promise<GetAllResults> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.resultRepo.find({
          where: {
            id: rest?.id,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.resultRepo.count({
          where: {
            id: rest?.id,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
