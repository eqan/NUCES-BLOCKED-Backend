import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { ProposalStatusEnum } from './enums/status.enum';

@ObjectType()
@Entity('Proposal')
@Unique(['id'])
export class Proposal extends Timestamps {
  @IsNotEmpty()
  @Field()
  @PrimaryColumn({ type: 'text' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  @Column()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  @Column()
  yesVotes: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  @Column()
  noVotes: number;

  @IsNotEmpty()
  @Field()
  @Column({
    type: 'enum',
    enum: ProposalStatusEnum,
    enumName: 'ProposalStatusEnum',
  })
  status: ProposalStatusEnum;
}
