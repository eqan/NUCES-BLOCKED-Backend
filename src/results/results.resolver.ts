import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateResultDto } from './dto/create-result.input';
import { DeleteResultsInput } from './dto/delete-result.input';
import { FilterResultInput } from './dto/filter.result.dto';
import { GetAllResults } from './dto/get-all-results.dto';
import { UpdateResultsInput } from './dto/update-result.input';
import { Result } from './entities/results.entity';
import { ResultsService } from './results.service';

@Resolver()
export class ResultsResolver extends BaseProvider<Result> {
  constructor(private readonly resultService: ResultsService) {
    super();
  }
  /**
   * Create Result
   * @param createResultInput
   * @returns Results
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Result, { name: 'CreateResult' })
  async create(
    @Args('CreateResultInput')
    createResultInput: CreateResultDto,
  ): Promise<Result> {
    try {
      return await this.resultService.create(createResultInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Result
   * @param deleteResultInput
   * @returns void
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Result, { name: 'DeleteResult', nullable: true })
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
  @Mutation(() => Result, { name: 'UpdateResult' })
  async edit(
    @Args('UpdateResultInput')
    updateResultStatus: UpdateResultsInput,
  ): Promise<Result> {
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
  @Query(() => Result, {
    name: 'GetResult',
    nullable: true,
  })
  async show(@Args('id') id: string): Promise<Result> {
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
