import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Certificate } from '../entities/certificates.entity';

@ObjectType('GetAllCertificates')
export class GetAllCertificates {
  @Field(() => [Certificate])
  items: Certificate[];

  @Field(() => Int)
  total: number;
}
