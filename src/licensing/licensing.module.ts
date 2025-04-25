import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensingService } from './licensing.service';
import { LicensingController } from './licensing.controller';
import { License } from './entities/license.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([License])
  ],
  providers: [LicensingService],
  controllers: [LicensingController],
  exports: [LicensingService], // Make sure this is here
})
export class LicensingModule {}