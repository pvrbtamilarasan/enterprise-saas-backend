// src/leave/leave.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaveService } from './leave.service';
import { LeaveRequest } from './entities/leave-request.entity';

@Controller('leave')
@UseGuards(AuthGuard('jwt'))
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Get()
  async findAll(@Query() query: any, @Request() req: any) {
    // If employee filter is provided or user is not admin, filter by employee
    if (query.employeeId || !req.user.roles.includes('admin')) {
      const employeeId = query.employeeId || req.user.id;
      return this.leaveService.findByEmployee(employeeId);
    }
    
    return this.leaveService.findAll(query);
  }

  @Get('pending')
  async findPending(@Request() req: any) {
    // Get pending leave requests for a manager
    if (req.user.roles.includes('manager') || req.user.roles.includes('admin')) {
      return this.leaveService.findPendingByManager(req.user.id);
    }
    
    return { error: 'Unauthorized', message: 'You must be a manager to view pending requests' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaveService.findById(id);
  }

  @Post()
  async create(@Body() createLeaveDto: Partial<LeaveRequest>, @Request() req: any) {
    // Set the employee ID to the current user if not specified
    if (!createLeaveDto.employeeId) {
      createLeaveDto.employeeId = req.user.id;
    }
    
    return this.leaveService.create(createLeaveDto);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string, @Request() req: any) {
    return this.leaveService.approve(id, req.user.id);
  }

  @Put(':id/reject')
  async reject(
    @Param('id') id: string, 
    @Body() body: { rejectionReason: string }, 
    @Request() req: any
  ) {
    return this.leaveService.reject(id, req.user.id, body.rejectionReason);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.leaveService.cancel(id, req.user.id);
  }
}