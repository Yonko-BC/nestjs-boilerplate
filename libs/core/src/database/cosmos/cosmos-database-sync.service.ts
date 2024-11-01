import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { CosmosClient, PartitionKeyDefinition } from '@azure/cosmos';
import { COSMOS_CLIENT, DATABASE_ID } from './cosmos.provider';

export interface ContainerConfig {
  id: string;
  partitionKey: PartitionKeyDefinition;
  uniqueKeyPolicy?: any;
  indexingPolicy?: any;
}

@Injectable()
export class DatabaseInitializer implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializer.name);
  constructor(
    @Inject(COSMOS_CLIENT) private readonly client: CosmosClient,
    @Inject(DATABASE_ID) private readonly databaseId: string,
    @Inject('CONTAINER_CONFIGS')
    private readonly containerConfigs: ContainerConfig[],
  ) {}

  async onModuleInit() {
    try {
      await this.initializeDatabaseAndContainers();
    } catch (error) {
      this.logger.error('Failed to initialize Cosmos DB', error);
      throw error;
    }
  }

  private async initializeDatabaseAndContainers() {
    // Ensure database exists
    await this.client.databases.createIfNotExists({ id: this.databaseId });

    for (const containerConfig of this.containerConfigs) {
      await this.createContainerIfNotExists(containerConfig);
    }
  }

  private async createContainerIfNotExists({
    id,
    partitionKey,
    uniqueKeyPolicy,
    indexingPolicy,
  }: ContainerConfig) {
    const database = this.client.database(this.databaseId);

    try {
      const { container } = await database.containers.createIfNotExists({
        id,
        partitionKey,
        uniqueKeyPolicy,
        indexingPolicy,
      });

      this.logger.log(
        `Ensured container ${id} exists in database ${this.databaseId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to create container ${id}`, error);
      throw error;
    }
  }

  // Optional: Method to drop and recreate containers (useful for testing/development)
  async recreateContainer(containerId: string) {
    const database = this.client.database(this.databaseId);

    try {
      // Try to delete existing container
      try {
        await database.container(containerId).delete();
        this.logger.log(`Deleted existing container ${containerId}`);
      } catch (deleteError) {
        // Container might not exist, which is fine
        this.logger.warn(`Container ${containerId} not found for deletion`);
      }

      // Recreate the container
      await this.initializeDatabaseAndContainers();
    } catch (error) {
      this.logger.error(`Failed to recreate container ${containerId}`, error);
      throw error;
    }
  }
}
