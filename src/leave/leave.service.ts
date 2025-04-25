// src/leave/leave.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
import { EmployeeService } from '../hcm/employee.service';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRepository: Repository<LeaveRequest>,
    private employeeService: EmployeeService,
  ) {}

  async findAll(filters: any = {}): Promise<LeaveRequest[]> {
    return this.leaveRepository.find({
      where: filters,
      relations: ['employee', 'manager', 'approvedBy'],
    });
  }

  async findByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return this.leaveRepository.find({
      where: { employeeId },
      relations: ['employee', 'manager', 'approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingByManager(managerId: string): Promise<LeaveRequest[]> {
    return this.leaveRepository.find({
      where: { 
        managerId,
        status: LeaveStatus.PENDING
      },
      relations: ['employee'],
      order: { startDate: 'ASC' },
    });
  }

  async findById(id: string): Promise<LeaveRequest> {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee', 'manager', 'approvedBy'],
    });
    
    if (!leave) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }
    
    return leave;
  }

  async create(createLeaveDto: Partial<LeaveRequest>): Promise<LeaveRequest> {
    // Calculate duration days and validate dates here
    const leave = this.leaveRepository.create(createLeaveDto);
    return this.leaveRepository.save(leave);
  }

  async approve(id: string, userId: string): Promise<LeaveRequest> {
    const leave = await this.findById(id);
    
    if (leave.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException('This leave request is no longer pending');
    }
    
    if (leave.managerId !== userId) {
      throw new ForbiddenException('You are not authorized to approve this request');
    }
    
    leave.status = LeaveStatus.APPROVED;
    leave.approvedById = userId;
    leave.approvedAt = new Date();
    
    return this.leaveRepository.save(leave);
  }

  async reject(id: string, userId: string, rejectionReason: string): Promise<LeaveRequest> {
    const leave = await this.findById(id);
    
    if (leave.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException('This leave request is no longer pending');
    }
    
    if (leave.managerId !== userId) {
      throw new ForbiddenException('You are not authorized to reject this request');
    }
    
    leave.status = LeaveStatus.REJECTED;
    leave.rejectionReason = rejectionReason;
    leave.approvedById = userId;
    leave.approvedAt = new Date();
    
    return this.leaveRepository.save(leave);
  }

  async cancel(id: string, userId: string): Promise<LeaveRequest> {
    const leave = await this.findById(id);
    
    if (leave.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException('Only pending leave requests can be cancelled');
    }
    
    if (leave.employeeId !== userId) {
      throw new ForbiddenException('You can only cancel your own leave requests');
    }
    
    leave.status = LeaveStatus.CANCELLED;
    
    return this.leaveRepository.save(leave);
  }
}