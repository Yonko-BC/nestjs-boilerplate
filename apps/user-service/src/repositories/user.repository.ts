import { Injectable, Inject } from '@nestjs/common';
import { CosmosClient } from '@azure/cosmos';
import { User } from '../entities/user.entity';
import { BaseRepository } from 'libs/core/src';
import {
  COSMOS_CLIENT,
  DATABASE_ID,
} from 'libs/core/src/database/cosmos/cosmos.provider';
import { PaginatedResult } from 'libs/core/src/interfaces';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @Inject(COSMOS_CLIENT) client: CosmosClient,
    @Inject(DATABASE_ID) databaseId: string,
  ) {
    super(client, databaseId, 'users');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findActiveUsers(): Promise<PaginatedResult<User>> {
    return this.findManyBy({ isActive: true });
  }
}
