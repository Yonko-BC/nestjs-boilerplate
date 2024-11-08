// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v5.28.2
// source: proto/shift.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "../google/protobuf/empty";
import { UserResponse } from "./user";

export const protobufPackage = "shift";

export interface Shift {
  id: string;
  name: string;
  departmentId: string;
  siteId: string;
  /** Time details */
  startTime: string;
  /** ISO format */
  endTime: string;
  /** Capacity details */
  minEmployeesRequired: number;
  maxEmployeesAllowed: number;
  /** Leadership */
  teamLeadId: string;
  shiftLeadId: string;
  /** Assigned employees */
  employeeIds: string[];
  status: Shift_ShiftStatus;
  /** Break management */
  breaks: BreakSchedule[];
  /** Additional metadata */
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  notes: string;
  tags: { [key: string]: string };
  metrics: ShiftMetrics | undefined;
  recurrence: RecurrenceRule | undefined;
}

/** Status */
export enum Shift_ShiftStatus {
  PLANNED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  ON_HOLD = 4,
  UNRECOGNIZED = -1,
}

export interface Shift_TagsEntry {
  key: string;
  value: string;
}

export interface BreakSchedule {
  startTime: string;
  endTime: string;
  /** e.g., "LUNCH", "REST" */
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
  /** DAILY, WEEKLY, MONTHLY */
  frequency: string;
  /** 0 = Sunday, 6 = Saturday */
  daysOfWeek: number[];
  /** Every X days/weeks/months */
  interval: number;
  /** ISO date */
  until: string;
  /** Number of occurrences */
  count: number;
}

/** Request/Response messages for new endpoints */
export interface BulkAssignEmployeesRequest {
  shiftId: string;
  departmentId: string;
  employeeIds: string[];
}

export interface SwapShiftsRequest {
  departmentId: string;
  employee1Id: string;
  shift1Id: string;
  employee2Id: string;
  shift2Id: string;
}

export interface SwapShiftsResponse {
  shift1: ShiftResponse | undefined;
  shift2: ShiftResponse | undefined;
  success: boolean;
}

export interface StartShiftRequest {
  shiftId: string;
  departmentId: string;
  startedBy?: string | undefined;
  notes?: string | undefined;
}

export interface EndShiftRequest {
  shiftId: string;
  departmentId: string;
  endedBy?: string | undefined;
  notes?: string | undefined;
  finalMetrics?: ShiftMetrics | undefined;
}

export interface CancelShiftRequest {
  shiftId: string;
  departmentId: string;
  reason: string;
  cancelledBy?: string | undefined;
}

export interface CreateRecurringShiftRequest {
  shiftTemplate: CreateShiftRequest | undefined;
  recurrence: RecurrenceRule | undefined;
}

export interface RecurringShiftResponse {
  recurringShiftId: string;
  generatedShifts: ShiftResponse[];
  recurrence: RecurrenceRule | undefined;
}

export interface GetShiftScheduleRequest {
  departmentId: string;
  startDate: string;
  endDate: string;
  siteId?: string | undefined;
  employeeId?: string | undefined;
}

export interface ShiftScheduleResponse {
  shifts: ShiftResponse[];
  employeeSummaries: { [key: string]: EmployeeScheduleSummary };
  scheduleMetrics: ScheduleMetrics | undefined;
}

export interface ShiftScheduleResponse_EmployeeSummariesEntry {
  key: string;
  value: EmployeeScheduleSummary | undefined;
}

export interface EmployeeScheduleSummary {
  employeeId: string;
  totalHours: number;
  totalShifts: number;
  shiftIds: string[];
}

export interface ScheduleMetrics {
  totalLaborHours: number;
  totalLaborCost: number;
  totalShifts: number;
  shiftsByStatus: { [key: string]: number };
}

export interface ScheduleMetrics_ShiftsByStatusEntry {
  key: string;
  value: number;
}

/** Keep existing messages but update ListShiftsResponse and ShiftResponse */
export interface ListShiftsResponse {
  items: ShiftResponse[];
  meta: PaginationMeta | undefined;
  links: PaginationLinks | undefined;
  hasMoreResults: boolean;
  continuationToken?: string | undefined;
}

export interface ShiftResponse {
  shift: Shift | undefined;
  employees: UserResponse[];
  teamLead: UserResponse | undefined;
  shiftLead: UserResponse | undefined;
}

/** Pagination messages (moved from user.proto) */
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationLinks {
  self: string;
  first: string;
  last: string;
  next?: string | undefined;
  prev?: string | undefined;
}

export interface CreateShiftRequest {
  name: string;
  departmentId: string;
  siteId: string;
  startTime: string;
  endTime: string;
  minEmployeesRequired: number;
  maxEmployeesAllowed: number;
  teamLeadId?: string | undefined;
  shiftLeadId?: string | undefined;
  breaks: BreakSchedule[];
  notes?: string | undefined;
  tags: { [key: string]: string };
}

export interface CreateShiftRequest_TagsEntry {
  key: string;
  value: string;
}

export interface GetShiftRequest {
  id: string;
  departmentId: string;
}

export interface UpdateShiftRequest {
  id: string;
  departmentId: string;
  name?: string | undefined;
  siteId?: string | undefined;
  startTime?: string | undefined;
  endTime?: string | undefined;
  minEmployeesRequired?: number | undefined;
  maxEmployeesAllowed?: number | undefined;
  teamLeadId?: string | undefined;
  shiftLeadId?: string | undefined;
  breaks: BreakSchedule[];
  notes?: string | undefined;
  tags: { [key: string]: string };
}

export interface UpdateShiftRequest_TagsEntry {
  key: string;
  value: string;
}

export interface DeleteShiftRequest {
  id: string;
  departmentId: string;
}

export interface AssignEmployeeRequest {
  shiftId: string;
  departmentId: string;
  employeeId: string;
}

export interface RemoveEmployeeRequest {
  shiftId: string;
  departmentId: string;
  employeeId: string;
}

export interface ListShiftsRequest {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortOrder: string;
  continuationToken: string;
  filter: { [key: string]: string };
}

export interface ListShiftsRequest_FilterEntry {
  key: string;
  value: string;
}

export const SHIFT_PACKAGE_NAME = "shift";

export interface ShiftServiceClient {
  /** Core shift operations */

  createShift(request: CreateShiftRequest): Observable<ShiftResponse>;

  getShift(request: GetShiftRequest): Observable<ShiftResponse>;

  updateShift(request: UpdateShiftRequest): Observable<ShiftResponse>;

  deleteShift(request: DeleteShiftRequest): Observable<Empty>;

  listShifts(request: ListShiftsRequest): Observable<ListShiftsResponse>;

  /** Employee management */

  assignEmployeeToShift(request: AssignEmployeeRequest): Observable<ShiftResponse>;

  removeEmployeeFromShift(request: RemoveEmployeeRequest): Observable<ShiftResponse>;

  bulkAssignEmployees(request: BulkAssignEmployeesRequest): Observable<ShiftResponse>;

  swapEmployeeShifts(request: SwapShiftsRequest): Observable<SwapShiftsResponse>;

  /** Shift status management */

  startShift(request: StartShiftRequest): Observable<ShiftResponse>;

  endShift(request: EndShiftRequest): Observable<ShiftResponse>;

  cancelShift(request: CancelShiftRequest): Observable<ShiftResponse>;

  /** Schedule management */

  createRecurringShift(request: CreateRecurringShiftRequest): Observable<RecurringShiftResponse>;

  getShiftSchedule(request: GetShiftScheduleRequest): Observable<ShiftScheduleResponse>;
}

export interface ShiftServiceController {
  /** Core shift operations */

  createShift(request: CreateShiftRequest): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  getShift(request: GetShiftRequest): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  updateShift(request: UpdateShiftRequest): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  deleteShift(request: DeleteShiftRequest): void;

  listShifts(
    request: ListShiftsRequest,
  ): Promise<ListShiftsResponse> | Observable<ListShiftsResponse> | ListShiftsResponse;

  /** Employee management */

  assignEmployeeToShift(
    request: AssignEmployeeRequest,
  ): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  removeEmployeeFromShift(
    request: RemoveEmployeeRequest,
  ): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  bulkAssignEmployees(
    request: BulkAssignEmployeesRequest,
  ): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  swapEmployeeShifts(
    request: SwapShiftsRequest,
  ): Promise<SwapShiftsResponse> | Observable<SwapShiftsResponse> | SwapShiftsResponse;

  /** Shift status management */

  startShift(request: StartShiftRequest): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  endShift(request: EndShiftRequest): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  cancelShift(request: CancelShiftRequest): Promise<ShiftResponse> | Observable<ShiftResponse> | ShiftResponse;

  /** Schedule management */

  createRecurringShift(
    request: CreateRecurringShiftRequest,
  ): Promise<RecurringShiftResponse> | Observable<RecurringShiftResponse> | RecurringShiftResponse;

  getShiftSchedule(
    request: GetShiftScheduleRequest,
  ): Promise<ShiftScheduleResponse> | Observable<ShiftScheduleResponse> | ShiftScheduleResponse;
}

export function ShiftServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createShift",
      "getShift",
      "updateShift",
      "deleteShift",
      "listShifts",
      "assignEmployeeToShift",
      "removeEmployeeFromShift",
      "bulkAssignEmployees",
      "swapEmployeeShifts",
      "startShift",
      "endShift",
      "cancelShift",
      "createRecurringShift",
      "getShiftSchedule",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ShiftService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ShiftService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SHIFT_SERVICE_NAME = "ShiftService";
