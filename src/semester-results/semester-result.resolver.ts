import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateResultDto } from './dto/create-semester-result.input';
import { DeleteResultsInput } from './dto/delete-semester-result.input';
import { FilterResultInput } from './dto/filter.semester-result.dto';
import { GetAllResults } from './dto/get-all-semester-results.dto';
import { UpdateResultsInput } from './dto/update-semester-result.input';
import { SemesterResult } from './entities/semester-result.entity';
import { SemesterResultService } from './semester-result.service';

@Resolver()
export class SemesterResultResolver extends BaseProvider<SemesterResult> {
  constructor(private readonly resultService: SemesterResultService) {
    super();
  }
  /**
   * Create Result
   * @param createResultInput
   * @returns Results
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => SemesterResult, { name: 'CreateResult' })
  async create(
    @Args('CreateResultInput')
    createResultInput: CreateResultDto,
  ): Promise<SemesterResult> {
    try {
      return await this.resultService.create(createResultInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => String, { name: 'StartResultCronJob' })
  startCronJob() {
    this.resultService.startProcess();
    return 'Cron Job Started';
  }

  @Mutation(() => String, { name: 'StopResultCronJob' })
  stopCronJob() {
    this.resultService.stopProcess();
    return 'Cron Job Stopped';
  }
  /**
   * Delete Result
   * @param deleteResultInput
   * @returns void
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => SemesterResult, { name: 'DeleteResult', nullable: true })
  async delete(
    @Args('DeleteResultInput')
    deleteResultInput: DeleteResultsInput,
  ): Promise<void> {
    try {
      await this.resultService.delete(deleteResultInput);
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Result Status
   * @param updateResultStatus
   * @returns Updated Result
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => SemesterResult, { name: 'UpdateResult' })
  async edit(
    @Args('UpdateResultInput')
    updateResultStatus: UpdateResultsInput,
  ): Promise<SemesterResult> {
    try {
      return await this.resultService.update(updateResultStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Result By address
   * @param id
   * @returns Result
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => SemesterResult, {
    name: 'GetResult',
    nullable: true,
  })
  async show(@Args('id') id: string): Promise<SemesterResult> {
    try {
      return await this.resultService.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Results
   * @param filterResultDto
   * @returns Searched or all users
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllResults, {
    name: 'GetAllResults',
  })
  async index(
    @Args('FilterResultInput', { nullable: true, defaultValue: {} })
    filterResultDto: FilterResultInput,
  ): Promise<GetAllResults> {
    try {
      return await this.resultService.index(filterResultDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
