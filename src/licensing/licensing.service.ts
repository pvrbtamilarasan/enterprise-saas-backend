import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from './entities/license.entity';

@Injectable()
export class LicensingService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
  ) {}

  async findByTenantId(tenantId: string): Promise<License | null> {
    return this.licenseRepository.findOne({
      where: { tenantId, isActive: true },
      relations: ['tenant'],
    });
  }

  async create(licenseData: Partial<License>): Promise<License> {
    const license = this.licenseRepository.create(licenseData);
    return this.licenseRepository.save(license);
  }

  async update(id: string, licenseData: Partial<License>): Promise<License | null> {
    await this.licenseRepository.update(id, licenseData);
    return this.licenseRepository.findOne({ where: { id } });
  }

  async isModuleEnabled(tenantId: string, moduleName: string): Promise<boolean> {
    const license = await this.findByTenantId(tenantId);
    if (!license || !license.isActive) {
      return false;
    }

    // Check if module is in the enabled modules list
    return license.enabledModules.includes(moduleName);
  }
}