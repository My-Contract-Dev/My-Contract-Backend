import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CubeService } from './cube.service';

describe('Cube service', () => {
  let cubeService: CubeService;

  beforeEach(async () => {
    const moduleDef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [CubeService],
    }).compile();
    cubeService = moduleDef.get<CubeService>(CubeService);
  });

  test('should get popular events', async () => {
    try {
      const data = await cubeService.getPopularEvents(
        '0xd4949664cd82660aae99bedc034a0dea8a0bd517',
      );
      console.log('===> Data', data);
    } catch (err: any) {
      console.error(err);
      console.error('Failed to get cube data', err.response.errors[0]);
    }
  });
});
