import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AggregatedCallDto {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => Int, { nullable: false })
  count: number;
}
