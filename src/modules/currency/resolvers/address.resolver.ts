import { Resolver } from '@nestjs/graphql';
import { AddressDto } from '../models';

@Resolver(() => AddressDto)
export class AddressResolver {}
