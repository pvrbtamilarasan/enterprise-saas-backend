// src/hcm/employee.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
    });
  }

  async findByManagerId(managerId: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { reportsTo: managerId },
    });
  }

  // Add more methods as needed
}