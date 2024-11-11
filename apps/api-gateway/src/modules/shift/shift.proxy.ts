import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  SHIFT_SERVICE_NAME,
  ShiftServiceClient,
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
  RemoveEmployeeRequest,
  StartShiftRequest,
  SwapShiftsRequest,
  UpdateShiftRequest,
} from 'libs/proto/shift/generated/proto/shift';
import { SERVICE_NAMES } from 'libs/core/src/constants';

@Injectable()
export class ShiftProxy implements OnModuleInit {
  private shiftService: ShiftServiceClient;

  constructor(
    @Inject(SERVICE_NAMES.SHIFT_SERVICE) private shiftClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.shiftService =
      this.shiftClient.getService<ShiftServiceClient>(SHIFT_SERVICE_NAME);
  }

  async createShift(request: CreateShiftRequest) {
    return firstValueFrom(this.shiftService.createShift(request));
  }

  async getShift(request: GetShiftRequest) {
    return firstValueFrom(this.shiftService.getShift(request));
  }

  async updateShift(request: UpdateShiftRequest) {
    return firstValueFrom(this.shiftService.updateShift(request));
  }

  async deleteShift(request: DeleteShiftRequest) {
    return firstValueFrom(this.shiftService.deleteShift(request));
  }

  async listShifts(request: ListShiftsRequest) {
    return firstValueFrom(this.shiftService.listShifts(request));
  }

  async assignEmployeeToShift(request: AssignEmployeeRequest) {
    return firstValueFrom(this.shiftService.assignEmployeeToShift(request));
  }

  async removeEmployeeFromShift(request: RemoveEmployeeRequest) {
    return firstValueFrom(this.shiftService.removeEmployeeFromShift(request));
  }

  async bulkAssignEmployees(request: BulkAssignEmployeesRequest) {
    return firstValueFrom(this.shiftService.bulkAssignEmployees(request));
  }

  async swapEmployeeShifts(request: SwapShiftsRequest) {
    return firstValueFrom(this.shiftService.swapEmployeeShifts(request));
  }

  async startShift(request: StartShiftRequest) {
    return firstValueFrom(this.shiftService.startShift(request));
  }

  async endShift(request: EndShiftRequest) {
    return firstValueFrom(this.shiftService.endShift(request));
  }

  async cancelShift(request: CancelShiftRequest) {
    return firstValueFrom(this.shiftService.cancelShift(request));
  }

  async createRecurringShift(request: CreateRecurringShiftRequest) {
    return firstValueFrom(this.shiftService.createRecurringShift(request));
  }

  async getShiftSchedule(request: GetShiftScheduleRequest) {
    return firstValueFrom(this.shiftService.getShiftSchedule(request));
  }
}
