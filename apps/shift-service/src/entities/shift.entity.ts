import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, EntityConstructorParams } from 'libs/core/src';

// Value Objects
export class ShiftTime {
  constructor(private readonly value: string) {
    // Add validation for ISO datetime format
    if (!Date.parse(value)) {
      throw new Error('Invalid date time format');
    }
  }

  getValue(): string {
    return this.value;
  }
}

export class ShiftName {
  constructor(private readonly value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Shift name must be at least 2 characters');
    }
  }

  getValue(): string {
    return this.value;
  }
}

export enum ShiftStatus {
  PLANNED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  ON_HOLD = 4,
}

export interface BreakSchedule {
  startTime: string;
  endTime: string;
  breakType: string;
  isPaid: boolean;
}

export interface ShiftMetrics {
  currentEmployeeCount: number;
  isUnderstaffed: boolean;
  isOverstaffed: boolean;
  laborCost: number;
  productivityScore: number;
}

export interface RecurrenceRule {
  frequency: string;
  daysOfWeek: number[];
  interval: number;
  until: string;
  count: number;
}

export class Shift extends BaseEntity {
  @ApiProperty({ description: 'Shift name', example: 'Morning Shift' })
  @Expose()
  @Transform(({ value }) => new ShiftName(value).getValue())
  @IsString()
  name: string;

  @ApiProperty({ description: 'Department ID' })
  @Expose()
  @IsString()
  departmentId: string;

  @ApiProperty({ description: 'Site ID' })
  @Expose()
  @IsString()
  siteId: string;

  @ApiProperty({ description: 'Start time in ISO format' })
  @Expose()
  @Transform(({ value }) => new ShiftTime(value).getValue())
  startTime: string;

  @ApiProperty({ description: 'End time in ISO format' })
  @Expose()
  @Transform(({ value }) => new ShiftTime(value).getValue())
  endTime: string;

  @ApiProperty({ description: 'Minimum required employees' })
  @Expose()
  @IsNumber()
  minEmployeesRequired: number;

  @ApiProperty({ description: 'Maximum allowed employees' })
  @Expose()
  @IsNumber()
  maxEmployeesAllowed: number;

  @ApiProperty({ description: 'Team lead ID' })
  @Expose()
  @IsString()
  teamLeadId: string;

  @ApiProperty({ description: 'Shift lead ID' })
  @Expose()
  @IsString()
  shiftLeadId: string;

  @ApiProperty({ description: 'List of employee IDs' })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  employeeIds: string[];

  @ApiProperty({ enum: ShiftStatus, description: 'Current shift status' })
  @Expose()
  @IsEnum(ShiftStatus)
  status: ShiftStatus;

  @ApiProperty({ description: 'Break schedules' })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => BreakScheduleVO)
  breaks: BreakSchedule[];

  @ApiProperty({ description: 'Whether the shift is active' })
  @Expose()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Additional notes' })
  @Expose()
  @IsString()
  notes: string;

  @ApiProperty({ description: 'Custom tags' })
  @Expose()
  tags: Record<string, string>;

  @ApiProperty({ description: 'Shift metrics' })
  @Expose()
  @ValidateNested()
  @Type(() => ShiftMetricsVO)
  metrics?: ShiftMetrics;

  @ApiProperty({ description: 'Recurrence rule' })
  @Expose()
  @ValidateNested()
  @Type(() => RecurrenceRuleVO)
  recurrence?: RecurrenceRule;

  constructor(
    params: EntityConstructorParams & {
      name: string;
      departmentId: string;
      siteId: string;
      startTime: string;
      endTime: string;
      minEmployeesRequired: number;
      maxEmployeesAllowed: number;
      teamLeadId?: string;
      shiftLeadId?: string;
      employeeIds?: string[];
      status?: ShiftStatus;
      breaks?: BreakSchedule[];
      isActive?: boolean;
      notes?: string;
      tags?: Record<string, string>;
      metrics?: ShiftMetrics;
      recurrence?: RecurrenceRule;
    },
  ) {
    super(params);
    this.name = new ShiftName(params.name).getValue();
    this.departmentId = params.departmentId;
    this.siteId = params.siteId;
    this.startTime = new ShiftTime(params.startTime).getValue();
    this.endTime = new ShiftTime(params.endTime).getValue();
    this.minEmployeesRequired = params.minEmployeesRequired;
    this.maxEmployeesAllowed = params.maxEmployeesAllowed;
    this.teamLeadId = params.teamLeadId || '';
    this.shiftLeadId = params.shiftLeadId || '';
    this.employeeIds = params.employeeIds || [];
    this.status = params.status || ShiftStatus.PLANNED;
    this.breaks = params.breaks || [];
    this.isActive = params.isActive ?? true;
    this.notes = params.notes || '';
    this.tags = params.tags || {};
    this.metrics = params.metrics;
    this.recurrence = params.recurrence;
  }

  // Domain methods
  startShift(): void {
    if (this.status !== ShiftStatus.PLANNED) {
      throw new Error('Shift can only be started from PLANNED status');
    }
    this.status = ShiftStatus.IN_PROGRESS;
    this.updateTimestamp();
  }

  endShift(): void {
    if (this.status !== ShiftStatus.IN_PROGRESS) {
      throw new Error('Only IN_PROGRESS shifts can be ended');
    }
    this.status = ShiftStatus.COMPLETED;
    this.updateTimestamp();
  }

  cancelShift(): void {
    if (this.status === ShiftStatus.COMPLETED) {
      throw new Error('Cannot cancel completed shifts');
    }
    this.status = ShiftStatus.CANCELLED;
    this.updateTimestamp();
  }

  addEmployee(employeeId: string): void {
    if (this.employeeIds.length >= this.maxEmployeesAllowed) {
      throw new Error('Shift is at maximum capacity');
    }
    if (!this.employeeIds.includes(employeeId)) {
      this.employeeIds.push(employeeId);
      this.updateTimestamp();
    }
  }

  removeEmployee(employeeId: string): void {
    const index = this.employeeIds.indexOf(employeeId);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
      this.updateTimestamp();
    }
  }

  updateMetrics(metrics: ShiftMetrics): void {
    this.metrics = metrics;
    this.updateTimestamp();
  }

  toObject(): Record<string, any> {
    return {
      ...super.toObject(),
      name: this.name,
      departmentId: this.departmentId,
      siteId: this.siteId,
      startTime: this.startTime,
      endTime: this.endTime,
      minEmployeesRequired: this.minEmployeesRequired,
      maxEmployeesAllowed: this.maxEmployeesAllowed,
      teamLeadId: this.teamLeadId,
      shiftLeadId: this.shiftLeadId,
      employeeIds: this.employeeIds,
      status: this.status,
      breaks: this.breaks,
      isActive: this.isActive,
      notes: this.notes,
      tags: this.tags,
      metrics: this.metrics,
      recurrence: this.recurrence,
    };
  }
}

// Value Object classes for validation
class BreakScheduleVO implements BreakSchedule {
  @IsString()
  @Transform(({ value }) => new ShiftTime(value).getValue())
  startTime: string;

  @IsString()
  @Transform(({ value }) => new ShiftTime(value).getValue())
  endTime: string;

  @IsString()
  breakType: string;

  @IsBoolean()
  isPaid: boolean;
}

class ShiftMetricsVO implements ShiftMetrics {
  @IsNumber()
  currentEmployeeCount: number;

  @IsBoolean()
  isUnderstaffed: boolean;

  @IsBoolean()
  isOverstaffed: boolean;

  @IsNumber()
  laborCost: number;

  @IsNumber()
  productivityScore: number;
}

class RecurrenceRuleVO implements RecurrenceRule {
  @IsString()
  frequency: string;

  @IsArray()
  @IsNumber({}, { each: true })
  daysOfWeek: number[];

  @IsNumber()
  interval: number;

  @IsString()
  @Transform(({ value }) => new ShiftTime(value).getValue())
  until: string;

  @IsNumber()
  count: number;
}
