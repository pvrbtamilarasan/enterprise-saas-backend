import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  // Common employee identifiers
  @Column({ length: 50, nullable: true })
  employeeId: string; // Internal employee ID

  // Personal Information
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100, nullable: true })
  middleName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 200, nullable: true })
  displayName: string;

  @Column({ length: 50, nullable: true })
  preferredName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ length: 1, nullable: true })
  gender: string; // M, F, O, etc.

  @Column({ length: 50, nullable: true })
  maritalStatus: string;

  @Column({ length: 50, nullable: true })
  nationality: string;

  @Column({ length: 50, nullable: true })
  taxId: string; // SSN, Tax Number, etc.

  // Contact Information
  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 100, nullable: true })
  workEmail: string;

  @Column({ length: 30, nullable: true })
  mobilePhone: string;

  @Column({ length: 30, nullable: true })
  workPhone: string;

  // Address Information
  @Column({ length: 200, nullable: true })
  addressLine1: string;

  @Column({ length: 200, nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 100, nullable: true })
  country: string;

  // Employment Information
  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ length: 50, nullable: true })
  employmentStatus: string; // Active, Inactive, On Leave, etc.

  @Column({ length: 50, nullable: true })
  employmentType: string; // Full-time, Part-time, Contract, etc.

  // Organizational Information
  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ length: 100, nullable: true })
  division: string;

  @Column({ length: 100, nullable: true })
  jobTitle: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ length: 100, nullable: true })
  reportsTo: string; // Manager/Supervisor ID

  // Compensation Information
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  baseSalary: number;

  @Column({ length: 10, nullable: true })
  payCurrency: string;

  @Column({ length: 50, nullable: true })
  payFrequency: string; // Monthly, Bi-weekly, etc.

  // Education and Skills
  @Column({ type: 'jsonb', nullable: true })
  education: object; // Array of education records

  @Column({ type: 'jsonb', nullable: true })
  skills: object; // Array of skills

  // Emergency Contact
  @Column({ length: 200, nullable: true })
  emergencyContactName: string;

  @Column({ length: 50, nullable: true })
  emergencyContactRelationship: string;

  @Column({ length: 30, nullable: true })
  emergencyContactPhone: string;

  // System Metadata
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 100, nullable: true })
  createdBy: string;

  @Column({ length: 100, nullable: true })
  updatedBy: string;

  // Additional custom fields
  @Column({ type: 'jsonb', nullable: true })
  customFields: object;
  
}