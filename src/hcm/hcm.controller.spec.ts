import { Test, TestingModule } from '@nestjs/testing';
import { HcmController } from './hcm.controller';

describe('HcmController', () => {
  let controller: HcmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HcmController],
    }).compile();

    controller = module.get<HcmController>(HcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
