import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { Empty } from 'libs/proto/user/generated/google/protobuf/empty';
import {
  AssignEmployeeRequest,
  BulkAssignEmployeesRequest,
  CancelShiftRequest,
  CreateRecurringShiftRequest,
  CreateShiftRequest,
  DeleteShiftRequest,
  EndShiftRequest,
  GetShiftRequest,
  GetShiftScheduleRequest,
  ListShiftsRequest,
  ListShiftsResponse,
  RecurringShiftResponse,
  RemoveEmployeeRequest,
  SHIFT_SERVICE_NAME,
  ShiftResponse,
  ShiftScheduleResponse,
  ShiftServiceController,
  ShiftServiceControllerMethods,
  StartShiftRequest,
  SwapShiftsRequest,
  SwapShiftsResponse,
  UpdateShiftRequest,
} from 'libs/proto/shift/generated/proto/shift';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftService } from './shift.service';
import { GrpcToSnakeCase } from 'libs/core/src/decorators/grpc-transform.decorator';

@Controller()
@ShiftServiceControllerMethods()
export class ShiftController implements ShiftServiceController {
  constructor(private readonly shiftService: ShiftService) {}

  @GrpcMethod(SHIFT_SERVICE_NAME)
  @GrpcToSnakeCase()
  async listShifts(request: ListShiftsRequest): Promise<ListShiftsResponse> {
    console.log('Transformed request:', request);

    const result = await this.shiftService.getAllShifts({
      pageSize: request.pageSize,
      pageNumber: request.pageNumber,
      sortBy: request.sortBy,
      sortOrder: request.sortOrder as 'asc' | 'desc',
      continuationToken: request.continuationToken,
      filter: request.filter,
    });

    return result as ListShiftsResponse;
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  @GrpcToSnakeCase()
  async createShift(request: CreateShiftRequest): Promise<ShiftResponse> {
    const createShiftDto = plainToClass(CreateShiftDto, {
      name: request.name,
      departmentId: request.departmentId,
      siteId: request.siteId,
      startTime: request.startTime,
      endTime: request.endTime,
      minEmployeesRequired: request.minEmployeesRequired,
      maxEmployeesAllowed: request.maxEmployeesAllowed,
      teamLeadId: request.teamLeadId,
      shiftLeadId: request.shiftLeadId,
      breaks: request.breaks,
      notes: request.notes,
      tags: request.tags,
    });

    return this.shiftService.createShift(createShiftDto);
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async getShift(request: GetShiftRequest): Promise<ShiftResponse> {
    return this.shiftService.getShiftById(request.id, request.departmentId);
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async updateShift(request: UpdateShiftRequest): Promise<ShiftResponse> {
    const updateShiftDto = plainToClass(UpdateShiftDto, {
      name: request.name,
      siteId: request.siteId,
      startTime: request.startTime,
      endTime: request.endTime,
      minEmployeesRequired: request.minEmployeesRequired,
      maxEmployeesAllowed: request.maxEmployeesAllowed,
      teamLeadId: request.teamLeadId,
      shiftLeadId: request.shiftLeadId,
      breaks: request.breaks,
      notes: request.notes,
      tags: request.tags,
    });

    return this.shiftService.updateShift(
      request.id,
      request.departmentId,
      updateShiftDto,
    );
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async deleteShift(request: DeleteShiftRequest): Promise<Empty> {
    await this.shiftService.deleteShift(request.id, request.departmentId);
    return {};
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async assignEmployeeToShift(
    request: AssignEmployeeRequest,
  ): Promise<ShiftResponse> {
    return this.shiftService.assignEmployeeToShift(
      request.shiftId,
      request.departmentId,
      request.employeeId,
    );
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async removeEmployeeFromShift(
    request: RemoveEmployeeRequest,
  ): Promise<ShiftResponse> {
    return this.shiftService.removeEmployeeFromShift(
      request.shiftId,
      request.departmentId,
      request.employeeId,
    );
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async bulkAssignEmployees(
    request: BulkAssignEmployeesRequest,
  ): Promise<ShiftResponse> {
    // Implement bulk assign logic
    throw new Error('Method not implemented.');
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async swapEmployeeShifts(
    request: SwapShiftsRequest,
  ): Promise<SwapShiftsResponse> {
    // Implement swap shifts logic
    throw new Error('Method not implemented.');
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async startShift(request: StartShiftRequest): Promise<ShiftResponse> {
    return this.shiftService.startShift(request.shiftId, request.departmentId);
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async endShift(request: EndShiftRequest): Promise<ShiftResponse> {
    return this.shiftService.endShift(request.shiftId, request.departmentId);
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async cancelShift(request: CancelShiftRequest): Promise<ShiftResponse> {
    return this.shiftService.cancelShift(request.shiftId, request.departmentId);
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async createRecurringShift(
    request: CreateRecurringShiftRequest,
  ): Promise<RecurringShiftResponse> {
    // Implement recurring shift creation logic
    throw new Error('Method not implemented.');
  }

  @GrpcMethod(SHIFT_SERVICE_NAME)
  async getShiftSchedule(
    request: GetShiftScheduleRequest,
  ): Promise<ShiftScheduleResponse> {
    // Implement get shift schedule logic
    throw new Error('Method not implemented.');
  }
}
