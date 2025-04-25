import { Test, TestingModule } from '@nestjs/testing';
import { LicensingController } from './licensing.controller';

describe('LicensingController', () => {
  let controller: LicensingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicensingController],
    }).compile();

    controller = module.get<LicensingController>(LicensingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
