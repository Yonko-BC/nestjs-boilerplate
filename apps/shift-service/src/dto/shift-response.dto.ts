import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { UserResponseDto } from 'apps/user-service/src/dto/user-response.dto';
import { Shift } from 'libs/proto/shift/generated/proto/shift';

@Exclude()
export class ShiftResponseDto {
  @Expose()
  @ApiProperty()
  shift: Shift;

  @Expose()
  @ApiProperty()
  @Type(() => UserResponseDto)
  employees: UserResponseDto[];

  @Expose()
  @ApiProperty()
  @Type(() => UserResponseDto)
  teamLead?: UserResponseDto;

  @Expose()
  @ApiProperty()
  @Type(() => UserResponseDto)
  shiftLead?: UserResponseDto;

  constructor(partial: Partial<ShiftResponseDto>) {
    Object.assign(this, partial);
  }
}
