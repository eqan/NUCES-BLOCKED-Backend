import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCertificateInput {
  @IsString({ message: 'Hash must be a String' })
  @Field()
  id: string;

  @IsString({ message: 'Url must be a String' })
  @Field()
  url: string;
}
