import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteCertificatesInput {
  @Field(() => [String]) id: string[];
}
