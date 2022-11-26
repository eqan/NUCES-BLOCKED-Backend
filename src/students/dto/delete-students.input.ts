import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteStudentsInput {
  @Field(() => [String]) id: string[];
}
