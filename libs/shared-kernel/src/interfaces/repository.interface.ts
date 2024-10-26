export interface IRepository<T> {
  create(item: T): Promise<T>;
  findById(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
