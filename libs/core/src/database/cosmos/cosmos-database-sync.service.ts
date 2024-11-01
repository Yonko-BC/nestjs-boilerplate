import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ContainerDefinition, CosmosClient } from '@azure/cosmos';
import {
  CONTAINER_CONFIGS,
  COSMOS_CLIENT,
  DATABASE_ID,
} from './cosmos.provider';

@Injectable()
export class DatabaseInitializer implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializer.name);

  constructor(
    @Inject(COSMOS_CLIENT) private readonly client: CosmosClient,
    @Inject(DATABASE_ID) private readonly databaseId: string,
    @Inject(CONTAINER_CONFIGS)
    private readonly containerConfigs: ContainerDefinition[],
  ) {}

  async onModuleInit() {
    if (!this.containerConfigs || this.containerConfigs.length === 0) {
      this.logger.warn('No containers specified in container configuration.');
      return;
    }

    try {
      await this.initializeDatabaseAndContainers();
    } catch (error) {
      this.logger.error('Failed to initialize Cosmos DB', error);
      throw error;
    }
  }

  private async initializeDatabaseAndContainers() {
    await this.client.databases.createIfNotExists({ id: this.databaseId });

    for (const containerConfig of this.containerConfigs) {
      await this.createContainerIfNotExists(containerConfig);
    }
  }

  private async createContainerIfNotExists(config: ContainerDefinition) {
    const database = this.client.database(this.databaseId);

    try {
      const { container } = await database.containers.createIfNotExists({
        id: config.id,
        partitionKey: config.partitionKey,
        uniqueKeyPolicy: config.uniqueKeyPolicy,
        indexingPolicy: config.indexingPolicy,
      });
      this.logger.log(`Ensured container ${container.id} exists.`);
    } catch (error) {
      this.logger.error(`Failed to create container ${config.id}`, error);
      throw error;
    }
  }
}
