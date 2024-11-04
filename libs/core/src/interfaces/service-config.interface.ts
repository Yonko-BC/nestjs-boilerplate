export interface IServiceConfig {
  port: number;
  databaseUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
