import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProposalStatusEnum } from '../entities/enums/status.enum';

@InputType()
export class CreateProposalDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  yesVotes: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  noVotes: number;

  @IsNotEmpty()
  @IsEnum(ProposalStatusEnum)
  @Field(() => ProposalStatusEnum)
  status: ProposalStatusEnum;
}
