import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './entities/tenant.entity';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  // This endpoint should return all tenants
  @Get()
  async findAll() {
    return this.tenantService.findAll();
  }

  // Your existing test-db endpoint
  @Get('test-db')
  async testDbConnection() {
    try {
      const tenant = await this.tenantService.findBySubdomain('test');
      return { 
        message: 'Database connection successful', 
        tenant: tenant 
      };
    } catch (error) {
      return { 
        message: 'Database connection failed', 
        error: error.message 
      };
    }
  }

  // Make sure this POST endpoint is correctly defined
  @Post()
  async create(@Body() createTenantDto: Partial<Tenant>) {
    console.log('Creating tenant:', createTenantDto);
    return this.tenantService.create(createTenantDto);
  }
}