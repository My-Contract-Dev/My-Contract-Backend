import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SimpleChartValueDto {
  @Field(() => Number, { nullable: false })
  value: number;

  @Field(() => String, { nullable: false })
  timestamp: string;
}
