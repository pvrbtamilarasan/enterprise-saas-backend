import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Tenant } from './entities/tenant.entity';
import { LicensingModule } from '../licensing/licensing.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {}