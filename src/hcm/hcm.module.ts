// src/hcm/hcm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HcmService } from './hcm.service';
import { HcmController } from './hcm.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [HcmService, EmployeeService],
  controllers: [HcmController],
  exports: [HcmService, EmployeeService],
})
export class HcmModule {}