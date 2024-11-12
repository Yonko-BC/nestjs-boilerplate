import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('The API Gateway API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  // Save swagger docs as JSON
  const swaggerPath = path.resolve(process.cwd(), 'swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });

  SwaggerModule.setup('api', app, document);
}
