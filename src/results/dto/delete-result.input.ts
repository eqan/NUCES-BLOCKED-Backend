import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteResultsInput {
  @Field(() => [String])
  id: string[];
}
