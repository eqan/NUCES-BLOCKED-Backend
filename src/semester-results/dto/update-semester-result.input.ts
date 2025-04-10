import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateResultsInput {
  @IsString()
  @Field()
  id: string;

  @IsString()
  @Field()
  url: string;
}
