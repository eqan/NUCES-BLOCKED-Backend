import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCertificateDto {
  @IsString()
  @Field()
  readonly studentId: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  readonly date: Date;

  @IsString()
  @Field()
  readonly url: string;
}
