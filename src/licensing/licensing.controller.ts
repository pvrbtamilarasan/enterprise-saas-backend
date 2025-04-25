import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { LicensingService } from './licensing.service';
import { License } from './entities/license.entity';

@Controller('licensing')
export class LicensingController {
  constructor(private licensingService: LicensingService) {}

  @Get('tenant/:tenantId')
  async getLicenseByTenant(@Param('tenantId') tenantId: string) {
    const license = await this.licensingService.findByTenantId(tenantId);
    return {
      license,
      success: !!license,
    };
  }

  @Post()
  async createLicense(@Body() licenseData: Partial<License>) {
    return this.licensingService.create(licenseData);
  }

  @Put(':id')
  async updateLicense(
    @Param('id') id: string,
    @Body() licenseData: Partial<License>,
  ) {
    return this.licensingService.update(id, licenseData);
  }

  @Get('check/:tenantId/:moduleName')
  async checkModuleAccess(
    @Param('tenantId') tenantId: string,
    @Param('moduleName') moduleName: string,
  ) {
    const isEnabled = await this.licensingService.isModuleEnabled(
      tenantId,
      moduleName,
    );
    return {
      tenantId,
      moduleName,
      isEnabled,
    };
  }
}