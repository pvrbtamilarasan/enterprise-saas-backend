// src/hcm/hcm.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class HcmService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  // Find all employees for a specific tenant
  async findAll(tenantId: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { tenantId, isActive: true },
    });
  }

  // Find an employee by ID, ensuring tenant security
  async findOne(id: string, tenantId: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id, tenantId },
    });
  }

  // Create a new employee
  async create(employeeData: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepository.create(employeeData);
    return this.employeeRepository.save(employee);
  }

  // Update an existing employee
  async update(id: string, tenantId: string, employeeData: Partial<Employee>): Promise<Employee | null> {
    // First verify the employee belongs to this tenant
    const employee = await this.findOne(id, tenantId);
    if (!employee) {
      return null;
    }

    // Update the employee
    await this.employeeRepository.update(id, employeeData);
    return this.findOne(id, tenantId);
  }

  // Soft delete an employee (mark as inactive)
  async remove(id: string, tenantId: string): Promise<boolean> {
    const employee = await this.findOne(id, tenantId);
    if (!employee) {
      return false;
    }

    await this.employeeRepository.update(id, { isActive: false });
    return true;
  }

  // Search employees by various criteria
  async search(tenantId: string, searchParams: Partial<Employee>): Promise<Employee[]> {
    // Build search query with tenant security
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee')
      .where('employee.tenantId = :tenantId', { tenantId })
      .andWhere('employee.isActive = :isActive', { isActive: true });

    // Add dynamic search conditions
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        if (typeof searchParams[key] === 'string') {
          // For string fields, use ILIKE for case-insensitive search
          queryBuilder.andWhere(`employee.${key} ILIKE :${key}`, { [key]: `%${searchParams[key]}%` });
        } else {
          // For other fields, use exact match
          queryBuilder.andWhere(`employee.${key} = :${key}`, { [key]: searchParams[key] });
        }
      }
    });

    return queryBuilder.getMany();
  }
}