import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ 
      where: { subdomain, isActive: true } 
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ 
      where: { id, isActive: true } 
    });
  }

  async create(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepository.create(tenantData);
    return this.tenantRepository.save(tenant);
  }
}