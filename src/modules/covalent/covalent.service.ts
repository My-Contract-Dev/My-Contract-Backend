import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CovalentService {
  constructor(private httpService: HttpService) {}
}
