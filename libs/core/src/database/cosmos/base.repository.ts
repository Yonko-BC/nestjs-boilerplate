import { Container, CosmosClient } from '@azure/cosmos';

export abstract class BaseRepository<T> {
  protected container: Container;

  constructor(
    protected client: CosmosClient,
    protected databaseId: string,
    protected containerId: string,
  ) {
    this.container = this.client
      .database(this.databaseId)
      .container(this.containerId);
  }

  async create(item: T): Promise<T> {
    const { resource } = await this.container.items.create(item);
    return resource;
  }

  async findById(id: string): Promise<T | undefined> {
    const { resource } = await this.container.item(id, id).read();
    return resource;
  }

  async find(query: any): Promise<T[]> {
    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }

  async update(id: string, item: T): Promise<T> {
    const { resource } = await this.container.item(id, id).replace(item);
    return resource;
  }

  async delete(id: string): Promise<void> {
    await this.container.item(id, id).delete();
  }

  async deleteAll(): Promise<void> {
    const { resources } = await this.container.items.readAll().fetchAll();
    for (const resource of resources) {
      await this.container.item(resource.id, resource.id).delete();
    }
  }
}
