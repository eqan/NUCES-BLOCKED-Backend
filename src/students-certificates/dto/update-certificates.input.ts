import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCertificatesInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  url: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  date: Date;
}
