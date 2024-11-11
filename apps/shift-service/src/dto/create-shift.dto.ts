import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { BreakSchedule } from '../entities/shift.entity';

export class BreakScheduleDto implements BreakSchedule {
  @ApiPropertyOptional({
    description: 'Start time of the break in ISO format',
    example: '2024-03-20T12:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({
    description: 'End time of the break in ISO format',
    example: '2024-03-20T13:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    description: 'Type of break',
    example: 'LUNCH',
  })
  @IsString()
  breakType: string;

  @ApiPropertyOptional({
    description: 'Whether this is a paid break',
    example: true,
  })
  @IsBoolean()
  isPaid: boolean;
}

export class CreateShiftDto {
  @ApiProperty({
    description: 'The name of the shift',
    example: 'Morning Shift A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The ID of the department this shift belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  departmentId: string;

  @ApiProperty({
    description: 'The ID of the site where this shift takes place',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  siteId: string;

  @ApiProperty({
    description: 'The start time of the shift in ISO format',
    example: '2024-03-20T09:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'The end time of the shift in ISO format',
    example: '2024-03-20T17:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Minimum number of employees required for this shift',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  minEmployeesRequired: number;

  @ApiProperty({
    description: 'Maximum number of employees allowed for this shift',
    example: 5,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  maxEmployeesAllowed: number;

  @ApiPropertyOptional({
    description: 'The ID of the team lead assigned to this shift',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsOptional()
  @IsUUID()
  teamLeadId?: string;

  @ApiPropertyOptional({
    description: 'The ID of the shift lead assigned to this shift',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsOptional()
  @IsUUID()
  shiftLeadId?: string;

  @ApiProperty({
    description: 'Array of break schedules for this shift',
    type: [BreakScheduleDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakScheduleDto)
  breaks: BreakSchedule[];

  @ApiPropertyOptional({
    description: 'Additional notes about the shift',
    example: 'Special training day',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Custom tags for the shift',
    example: { priority: 'high', type: 'training' },
  })
  @IsOptional()
  tags?: Record<string, string>;
}
