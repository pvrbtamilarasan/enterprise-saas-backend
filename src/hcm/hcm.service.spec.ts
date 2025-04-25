import { Test, TestingModule } from '@nestjs/testing';
import { HcmService } from './hcm.service';

describe('HcmService', () => {
  let service: HcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HcmService],
    }).compile();

    service = module.get<HcmService>(HcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
