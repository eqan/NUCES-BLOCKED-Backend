import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Certificates } from '../entities/certificates.entity';

@ObjectType('GetAllCertificates')
export class GetAllCertificates {
  @Field(() => [Certificates])
  items: Certificates[];

  @Field(() => Int)
  total: number;
}
