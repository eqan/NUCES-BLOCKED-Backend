import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteProposalsInput {
  @Field(() => [String])
  id: string[];
}
