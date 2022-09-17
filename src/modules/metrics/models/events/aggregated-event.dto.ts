import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AggregatedEventDto {
  @Field(() => String, { nullable: false })
  readonly name: string;

  @Field(() => Int, { nullable: false })
  readonly count: number;
}
