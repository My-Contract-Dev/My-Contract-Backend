import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AggregatedMethodGasDto {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => Float, { nullable: false })
  averageGas: number;
}
