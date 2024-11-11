import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';
import { BreakSchedule } from '../entities/shift.entity';
import { BreakScheduleDto } from './create-shift.dto';

export class UpdateShiftDto {
  @ApiPropertyOptional({
    description: 'The name of the shift',
    example: 'Morning Shift A',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The ID of the site where this shift takes place',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  siteId?: string;

  @ApiPropertyOptional({
    description: 'The start time of the shift in ISO format',
    example: '2024-03-20T09:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'The end time of the shift in ISO format',
    example: '2024-03-20T17:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Minimum number of employees required for this shift',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minEmployeesRequired?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of employees allowed for this shift',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxEmployeesAllowed?: number;

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

  @ApiPropertyOptional({
    description: 'Array of break schedules for this shift',
    type: [BreakScheduleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakScheduleDto)
  breaks?: BreakSchedule[];

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
