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
} from 'class-validator';
import { BreakSchedule } from '../entities/shift.entity';

export class CreateShiftDto {
  @ApiProperty({ example: 'Morning Shift' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsString()
  siteId: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty()
  @IsNumber()
  minEmployeesRequired: number;

  @ApiProperty()
  @IsNumber()
  maxEmployeesAllowed: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamLeadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shiftLeadId?: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakScheduleDto)
  breaks: BreakSchedule[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  tags?: Record<string, string>;
}

class BreakScheduleDto implements BreakSchedule {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  breakType: string;

  @IsBoolean()
  isPaid: boolean;
}
