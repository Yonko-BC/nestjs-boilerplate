import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateShiftDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minEmployeesRequired?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxEmployeesAllowed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamLeadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shiftLeadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakScheduleDto)
  breaks?: BreakSchedule[];

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
