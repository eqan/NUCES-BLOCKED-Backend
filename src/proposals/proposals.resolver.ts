import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Proposal } from './entities/proposals.entity';
import { ProposalsService } from './proposals.service';
import { GetAllProposals } from './dto/get-all-proposals.dto';
import { FilterProposalInput } from './dto/filter.proposals.dto';
import { CreateProposalDto } from './dto/create-proposal.input';

@Resolver(() => Proposal)
export class ProposalsResolver {
  constructor(private readonly proposalsService: ProposalsService) {}

  /**
   * Create Proposal
   * @param createProposalInput
   * @returns Proposals
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Proposal, { name: 'CreateProposal' })
  async create(
    @Args('CreateProposalInput')
    createProposalInput: CreateProposalDto,
  ): Promise<Proposal> {
    try {
      return await this.proposalsService.create(createProposalInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => String, { name: 'StartProposalCronJob' })
  startCronJob() {
    this.proposalsService.startProcess();
    return 'Cron Job Started';
  }

  @Mutation(() => String, { name: 'StopProposalCronJob' })
  stopCronJob() {
    this.proposalsService.stopProcess();
    return 'Cron Job Stopped';
  }

  @Mutation(() => String, {
    name: 'UpdateAllStatusFromBlockchainAndDatabase',
  })
  async updateAllStatusesFromBlockchainAndDatabase() {
    try {
      await this.proposalsService.updateAllStatusesFromBlockchainAndDatabase();
      return 'Status have been updated!';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Proposals
   * @param filterProposalDto
   * @returns Searched or all users
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllProposals, {
    name: 'GetAllProposals',
  })
  async index(
    @Args('FilterProposalInput', { nullable: true, defaultValue: {} })
    filterProposalDto: FilterProposalInput,
  ): Promise<GetAllProposals> {
    try {
      return await this.proposalsService.index(filterProposalDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
