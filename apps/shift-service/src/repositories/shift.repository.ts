import { Injectable, Inject } from '@nestjs/common';
import { CosmosClient } from '@azure/cosmos';
import { Shift } from '../entities/shift.entity';
import { BaseRepository } from 'libs/core/src';
import {
  COSMOS_CLIENT,
  DATABASE_ID,
} from 'libs/core/src/database/cosmos/cosmos.provider';
import { PaginatedResult, PaginationOptions } from 'libs/core/src/interfaces';

@Injectable()
export class ShiftRepository extends BaseRepository<Shift> {
  constructor(
    @Inject(COSMOS_CLIENT) client: CosmosClient,
    @Inject(DATABASE_ID) databaseId: string,
  ) {
    super(client, databaseId, 'shifts');
  }

  async findByDepartmentAndDateRange(
    departmentId: string,
    startDate: string,
    endDate: string,
    siteId?: string,
  ): Promise<Shift[]> {
    const query = {
      query: `
        SELECT * FROM c 
        WHERE c.departmentId = @departmentId 
        AND c.startTime >= @startDate 
        AND c.endTime <= @endDate
        ${siteId ? 'AND c.siteId = @siteId' : ''}
      `,
      parameters: [
        { name: '@departmentId', value: departmentId },
        { name: '@startDate', value: startDate },
        { name: '@endDate', value: endDate },
        ...(siteId ? [{ name: '@siteId', value: siteId }] : []),
      ],
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }

  async findByEmployeeId(employeeId: string): Promise<Shift[]> {
    const { resources } = await this.container.items
      .query({
        query:
          'SELECT * FROM c WHERE ARRAY_CONTAINS(c.employeeIds, @employeeId)',
        parameters: [{ name: '@employeeId', value: employeeId }],
      })
      .fetchAll();

    return resources;
  }

  async findActiveShifts(departmentId: string): Promise<Shift[]> {
    const { resources } = await this.container.items
      .query({
        query:
          'SELECT * FROM c WHERE c.departmentId = @departmentId AND c.isActive = true',
        parameters: [{ name: '@departmentId', value: departmentId }],
      })
      .fetchAll();

    return resources;
  }

  // protected mapToEntity(item: Record<string, any>): Shift {
  //   return new Shift({
  //     ...item,
  //     id: item.id,
  //     partitionKey: item.partitionKey,
  //   });
  // }
}
