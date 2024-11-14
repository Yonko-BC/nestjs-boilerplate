import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ShiftRepository } from './repositories/shift.repository';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { PaginatedResult, PaginationOptions } from 'libs/core/src/interfaces';
import { UpdateShiftDto } from './dto/update-shift.dto';
import {
  Shift_ShiftStatus,
  ShiftResponse,
} from 'libs/proto/shift/generated/proto/shift';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { SERVICE_NAMES } from 'libs/core/src/constants';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'libs/proto/shift/generated/proto/user';
import { firstValueFrom } from 'rxjs';
import { ValidationException } from 'libs/core/src/exceptions';

@Injectable()
export class ShiftService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject(SERVICE_NAMES.USER_SERVICE) private userClient: ClientGrpc,
    private readonly shiftRepository: ShiftRepository,
  ) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createShift(dto: CreateShiftDto): Promise<ShiftResponse> {
    // const shift = new Shift({
    //   ...dto,
    //   partitionKey: dto.departmentId,
    // });

    throw new RpcException(
      new ValidationException([
        {
          property: 'ok',
          constraints: {
            isNotEmpty: 'Name is required',
          },
        },
      ]),
    );
    // const createdShift = await this.shiftRepository.create(shift);
    // return this.transformToShiftResponse(createdShift);
  }

  async getShiftById(id: string, departmentId: string): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(id, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return this.transformToShiftResponse(shift);
  }

  async getAllShifts(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ShiftResponse>> {
    const result = await this.shiftRepository.findAll(options);
    const items = await Promise.all(
      result.items.map((shift) => this.transformToShiftResponse(shift)),
    );
    return {
      ...result,
      items,
    };
  }

  async updateShift(
    id: string,
    departmentId: string,
    updateData: UpdateShiftDto,
  ): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(id, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    const updatedShift = await this.shiftRepository.update(
      id,
      departmentId,
      updateData,
    );

    return this.transformToShiftResponse(updatedShift);
  }

  async deleteShift(id: string, departmentId: string): Promise<void> {
    const shift = await this.shiftRepository.findById(id, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    await this.shiftRepository.delete(id, departmentId);
  }

  async assignEmployeeToShift(
    shiftId: string,
    departmentId: string,
    employeeId: string,
  ): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(shiftId, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }

    shift.addEmployee(employeeId);
    const updatedShift = await this.shiftRepository.update(
      shiftId,
      departmentId,
      shift,
    );
    return this.transformToShiftResponse(updatedShift);
  }

  async removeEmployeeFromShift(
    shiftId: string,
    departmentId: string,
    employeeId: string,
  ): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(shiftId, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }

    shift.removeEmployee(employeeId);
    const updatedShift = await this.shiftRepository.update(
      shiftId,
      departmentId,
      shift,
    );
    return this.transformToShiftResponse(updatedShift);
  }

  async startShift(
    shiftId: string,
    departmentId: string,
  ): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(shiftId, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }

    shift.startShift();
    const updatedShift = await this.shiftRepository.update(
      shiftId,
      departmentId,
      shift,
    );
    return this.transformToShiftResponse(updatedShift);
  }

  async endShift(
    shiftId: string,
    departmentId: string,
  ): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(shiftId, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }

    shift.endShift();
    const updatedShift = await this.shiftRepository.update(
      shiftId,
      departmentId,
      shift,
    );
    return this.transformToShiftResponse(updatedShift);
  }

  async cancelShift(
    shiftId: string,
    departmentId: string,
  ): Promise<ShiftResponse> {
    const shift = await this.shiftRepository.findById(shiftId, departmentId);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftId} not found`);
    }

    shift.cancelShift();
    const updatedShift = await this.shiftRepository.update(
      shiftId,
      departmentId,
      shift,
    );
    return this.transformToShiftResponse(updatedShift);
  }

  private async transformToShiftResponse(shift: Shift): Promise<ShiftResponse> {
    const [employees, teamLead, shiftLead] = await Promise.all([
      Promise.all(
        shift.employeeIds.map((id) =>
          firstValueFrom(
            this.userService.getUser({ id, departmentId: shift.departmentId }),
          ),
        ),
      ),
      shift.teamLeadId
        ? firstValueFrom(
            this.userService.getUser({
              id: shift.teamLeadId,
              departmentId: shift.departmentId,
            }),
          )
        : Promise.resolve(undefined),
      shift.shiftLeadId
        ? firstValueFrom(
            this.userService.getUser({
              id: shift.shiftLeadId,
              departmentId: shift.departmentId,
            }),
          )
        : Promise.resolve(undefined),
    ]);

    return {
      shift: {
        id: shift.id,
        name: shift.name,
        departmentId: shift.departmentId,
        siteId: shift.siteId,
        startTime: shift.startTime,
        endTime: shift.endTime,
        employeeIds: shift.employeeIds,
        teamLeadId: shift.teamLeadId,
        shiftLeadId: shift.shiftLeadId,
        minEmployeesRequired: shift.minEmployeesRequired,
        maxEmployeesAllowed: shift.maxEmployeesAllowed,
        breaks: shift.breaks,
        isActive: shift.isActive,
        notes: shift.notes,
        tags: shift.tags,
        metrics: shift.metrics,
        recurrence: shift.recurrence,
        status: shift.status as unknown as Shift_ShiftStatus,
        createdAt: shift.createdAt.toISOString(),
        updatedAt: shift.updatedAt.toISOString(),
      },
      employees,
      teamLead,
      shiftLead,
    };
  }
}
