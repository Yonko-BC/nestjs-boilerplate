import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ShiftProxy } from './shift.proxy';
import {
  AssignEmployeeRequest,
  BulkAssignEmployeesRequest,
  CancelShiftRequest,
  CreateRecurringShiftRequest,
  CreateShiftRequest,
  EndShiftRequest,
  GetShiftRequest,
  GetShiftScheduleRequest,
  ListShiftsRequest,
  RemoveEmployeeRequest,
  StartShiftRequest,
  SwapShiftsRequest,
  UpdateShiftRequest,
} from 'libs/proto/shift/generated/proto/shift';
import { CreateShiftDto } from 'apps/shift-service/src/dto/create-shift.dto';
import { UpdateShiftDto } from 'apps/shift-service/src/dto/update-shift.dto';
import { ShiftResponseDto } from 'apps/shift-service/src/dto/shift-response.dto';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftProxy: ShiftProxy) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new shift',
    description: 'Creates a new shift with the provided details',
  })
  @ApiBody({ type: CreateShiftDto })
  @ApiResponse({
    status: 201,
    description: 'The shift has been successfully created.',
    type: ShiftResponseDto,
  })
  async createShift(@Body() createShiftRequest: CreateShiftRequest) {
    return this.shiftProxy.createShift(createShiftRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a shift by ID',
    description: 'Retrieves shift details by ID and department',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the shift to retrieve',
    required: true,
  })
  @ApiQuery({
    name: 'departmentId',
    description: 'The department ID the shift belongs to',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The shift details',
    type: ShiftResponseDto,
  })
  async getShift(
    @Param('id') id: string,
    @Query('departmentId') departmentId: string,
  ) {
    const request: GetShiftRequest = { id, departmentId };
    return this.shiftProxy.getShift(request);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a shift',
    description: 'Updates an existing shift with the provided details',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the shift to update',
    required: true,
  })
  @ApiQuery({
    name: 'departmentId',
    description: 'The department ID the shift belongs to',
    required: true,
  })
  @ApiBody({ type: UpdateShiftDto })
  @ApiResponse({
    status: 200,
    description: 'The shift has been successfully updated.',
    type: ShiftResponseDto,
  })
  async updateShift(
    @Param('id') id: string,
    @Query('departmentId') departmentId: string,
    @Body() updateData: Omit<UpdateShiftRequest, 'id' | 'departmentId'>,
  ) {
    const request: UpdateShiftRequest = {
      id,
      departmentId,
      ...updateData,
    };
    return this.shiftProxy.updateShift(request);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a shift',
    description: 'Deletes a shift by ID and department',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the shift to delete',
    required: true,
  })
  @ApiQuery({
    name: 'departmentId',
    description: 'The department ID the shift belongs to',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The shift has been successfully deleted.',
  })
  async deleteShift(
    @Param('id') id: string,
    @Query('departmentId') departmentId: string,
  ) {
    return this.shiftProxy.deleteShift({ id, departmentId });
  }

  @Get()
  @ApiOperation({
    summary: 'List all shifts',
    description: 'Retrieves a paginated list of shifts with optional filters',
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of items per page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Field to sort by',
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort order (asc/desc)',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of shifts retrieved successfully.',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/ShiftResponseDto' },
        },
        meta: {
          $ref: '#/components/schemas/PaginationMetaDto',
        },
        links: {
          $ref: '#/components/schemas/PaginationLinksDto',
        },
      },
    },
  })
  async listShifts(@Query() query: ListShiftsRequest) {
    return this.shiftProxy.listShifts(query);
  }

  @Post(':id/assign')
  @ApiOperation({
    summary: 'Assign an employee to a shift',
    description: 'Assigns an employee to a specific shift',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the shift',
    required: true,
  })
  @ApiBody({
    schema: {
      properties: {
        departmentId: {
          type: 'string',
          description: 'Department ID',
        },
        employeeId: {
          type: 'string',
          description: 'Employee ID to assign',
        },
      },
      required: ['departmentId', 'employeeId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Employee successfully assigned to shift.',
    type: ShiftResponseDto,
  })
  async assignEmployee(
    @Param('id') shiftId: string,
    @Body() request: Omit<AssignEmployeeRequest, 'shiftId'>,
  ) {
    return this.shiftProxy.assignEmployeeToShift({
      shiftId,
      ...request,
    });
  }

  @Post(':id/remove-employee')
  @ApiOperation({
    summary: 'Remove an employee from a shift',
    description: 'Removes an assigned employee from a shift',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the shift',
    required: true,
  })
  @ApiBody({
    schema: {
      properties: {
        departmentId: {
          type: 'string',
          description: 'Department ID',
        },
        employeeId: {
          type: 'string',
          description: 'Employee ID to remove',
        },
      },
      required: ['departmentId', 'employeeId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Employee successfully removed from shift.',
    type: ShiftResponseDto,
  })
  async removeEmployee(
    @Param('id') shiftId: string,
    @Body() request: Omit<RemoveEmployeeRequest, 'shiftId'>,
  ) {
    return this.shiftProxy.removeEmployeeFromShift({
      shiftId,
      ...request,
    });
  }

  @Post('bulk-assign')
  @ApiOperation({
    summary: 'Bulk assign employees to shifts',
    description: 'Assigns multiple employees to a shift in a single operation',
  })
  @ApiBody({
    schema: {
      properties: {
        shiftId: {
          type: 'string',
          description: 'Shift ID',
        },
        departmentId: {
          type: 'string',
          description: 'Department ID',
        },
        employeeIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of employee IDs to assign',
        },
      },
      required: ['shiftId', 'departmentId', 'employeeIds'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Employees successfully assigned in bulk.',
    type: ShiftResponseDto,
  })
  async bulkAssignEmployees(@Body() request: BulkAssignEmployeesRequest) {
    return this.shiftProxy.bulkAssignEmployees(request);
  }

  //   @Post('swap')
  //   @ApiOperation({ summary: 'Swap shifts between employees' })
  //   @ApiBody({ type: SwapShiftsRequest })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Shifts successfully swapped.',
  //     type: SwapShiftsResponse,
  //   })
  //   async swapShifts(@Body() request: SwapShiftsRequest) {
  //     return this.shiftProxy.swapEmployeeShifts(request);
  //   }

  //   @Post(':id/start')
  //   @ApiOperation({ summary: 'Start a shift' })
  //   @ApiParam({ name: 'id', description: 'Shift ID' })
  //   @ApiBody({ type: StartShiftRequest })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Shift successfully started.',
  //     type: ShiftResponseDto,
  //   })
  //   async startShift(
  //     @Param('id') shiftId: string,
  //     @Body() request: Omit<StartShiftRequest, 'shiftId'>,
  //   ) {
  //     return this.shiftProxy.startShift({
  //       shiftId,
  //       ...request,
  //     });
  //   }

  //   @Post(':id/end')
  //   @ApiOperation({ summary: 'End a shift' })
  //   @ApiParam({ name: 'id', description: 'Shift ID' })
  //   @ApiBody({ type: EndShiftRequest })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Shift successfully ended.',
  //     type: ShiftResponseDto,
  //   })
  //   async endShift(
  //     @Param('id') shiftId: string,
  //     @Body() request: Omit<EndShiftRequest, 'shiftId'>,
  //   ) {
  //     return this.shiftProxy.endShift({
  //       shiftId,
  //       ...request,
  //     });
  //   }

  //   @Post(':id/cancel')
  //   @ApiOperation({ summary: 'Cancel a shift' })
  //   @ApiParam({ name: 'id', description: 'Shift ID' })
  //   @ApiBody({ type: CancelShiftRequest })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Shift successfully cancelled.',
  //     type: ShiftResponseDto,
  //   })
  //   async cancelShift(
  //     @Param('id') shiftId: string,
  //     @Body() request: Omit<CancelShiftRequest, 'shiftId'>,
  //   ) {
  //     return this.shiftProxy.cancelShift({
  //       shiftId,
  //       ...request,
  //     });
  //   }

  //   @Post('recurring')
  //   @ApiOperation({ summary: 'Create a recurring shift' })
  //   @ApiBody({ type: CreateRecurringShiftRequest })
  //   @ApiResponse({
  //     status: 201,
  //     description: 'Recurring shift successfully created.',
  //     type: RecurringShiftResponse,
  //   })
  //   async createRecurringShift(@Body() request: CreateRecurringShiftRequest) {
  //     return this.shiftProxy.createRecurringShift(request);
  //   }

  //   @Get('schedule')
  //   @ApiOperation({ summary: 'Get shift schedule' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Shift schedule successfully retrieved.',
  //     type: ShiftScheduleResponse,
  //   })
  //   async getShiftSchedule(@Query() request: GetShiftScheduleRequest) {
  //     return this.shiftProxy.getShiftSchedule(request);
  //   }
}
