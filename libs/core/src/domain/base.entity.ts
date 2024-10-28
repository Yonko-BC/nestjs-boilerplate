export abstract class BaseEntity {
  id: string;
  partitionKey: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, partitionKey: string) {
    this.id = id;
    this.partitionKey = partitionKey;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
