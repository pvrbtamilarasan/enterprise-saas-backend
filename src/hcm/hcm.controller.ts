// src/hcm/hcm.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { HcmService } from './hcm.service';
import { Employee } from './entities/employee.entity';

@Controller('hcm')
export class HcmController {
  constructor(private hcmService: HcmService) {}

  @Get('employees')
  async findAll(@Query('tenantId') tenantId: string) {
    return this.hcmService.findAll(tenantId);
  }

  @Get('employees/:id')
  async findOne(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.hcmService.findOne(id, tenantId);
  }

  @Post('employees')
  async create(@Body() createEmployeeDto: Partial<Employee>) {
    return this.hcmService.create(createEmployeeDto);
  }

  @Put('employees/:id')
  async update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() updateEmployeeDto: Partial<Employee>,
  ) {
    return this.hcmService.update(id, tenantId, updateEmployeeDto);
  }

  @Delete('employees/:id')
  async remove(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.hcmService.remove(id, tenantId);
  }

  @Post('employees/search')
  async search(
    @Query('tenantId') tenantId: string,
    @Body() searchParams: Partial<Employee>,
  ) {
    return this.hcmService.search(tenantId, searchParams);
  }
}