import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCertificateDto {
  @IsString()
  @Field()
  readonly id: string;

  @IsString()
  @Field()
  readonly url: string;
}
