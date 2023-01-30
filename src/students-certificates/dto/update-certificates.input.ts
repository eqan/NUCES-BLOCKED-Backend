import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCertificatesInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  studentId: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  url: string;
}
