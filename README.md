# NestJS Microservices Architecture

This project implements a scalable and maintainable microservices architecture using NestJS, gRPC, and Azure Cosmos DB. The architecture is designed to promote modularity, scalability, and separation of concerns.

## Project Structure

The project is organized into the following main directories:

- `apps/`: Contains the API Gateway and individual microservices
- `libs/`: Shared libraries and core functionality
- `proto/`: Protocol Buffer definitions for gRPC services
- `tools/`: Code generators and development tools

### API Gateway

The API Gateway (`apps/api-gateway`) serves as the entry point for client requests. It routes requests to the appropriate microservices and handles cross-cutting concerns such as authentication and request/response transformation.

Key principles:

1. **Modular Structure**: The gateway is organized into modules (auth, user, order) for better separation of concerns.
2. **Configuration Management**: Configurations for the app, gRPC clients, and Swagger are centralized in the `config/` directory.
3. **Proxy Pattern**: Each module uses a proxy (e.g., `user.proxy.ts`) to communicate with its corresponding microservice via gRPC.

### Shared Libraries (libs/)

The `libs/` directory contains shared code and core functionality used across multiple microservices.

#### Core Library

The core library (`libs/core`) provides base classes and utilities for common tasks:

1. **Database Access**: `BaseRepository` in `database/cosmos/base.repository.ts` provides a generic repository pattern for Cosmos DB operations.
2. **Domain Models**: `BaseEntity` and `ValueObject` in the `domain/` directory serve as base classes for domain entities and value objects.
3. **gRPC Controllers**: `BaseGrpcController` in `grpc/base.controller.ts` provides a foundation for gRPC method handlers.

#### Shared Kernel

The shared kernel (`libs/shared-kernel`) contains code shared across all services:

1. **DTOs**: Data Transfer Objects for consistent data structures between services.
2. **Interfaces**: Common interfaces, such as `IRepository`.
3. **Constants**: Shared constant values, like error messages.
4. **Exceptions**: Custom exception classes for standardized error handling.

### Protocol Buffers (proto/)

The `proto/` directory contains the Protocol Buffer definitions for gRPC services. These files define the contract between the API Gateway and the microservices.

### Code Generators (tools/)

The `tools/` directory contains code generators to automate repetitive tasks:

1. **Proto Generator**: Generates TypeScript interfaces from Protocol Buffer definitions.
2. **Service Generator**: (To be implemented) Scaffolds new microservices.

## Key Principles and Best Practices

1. **Separation of Concerns**: Each microservice and module focuses on a specific domain or functionality.
2. **DRY (Don't Repeat Yourself)**: Common code is extracted into shared libraries to promote reusability.
3. **SOLID Principles**: The architecture adheres to SOLID principles, particularly the Single Responsibility and Dependency Inversion principles.
4. **Scalability**: The microservices architecture allows for independent scaling of services.
5. **Maintainability**: Modular structure and clear separation of concerns make the codebase easier to maintain and extend.
6. **Type Safety**: TypeScript is used throughout the project to ensure type safety and improve developer experience.
7. **Consistent Communication**: gRPC is used for efficient and type-safe communication between services.
8. **Database Abstraction**: The `BaseRepository` provides a consistent interface for database operations across services.
9. **Error Handling**: Centralized error messages and custom exceptions ensure consistent error reporting.
10. **Code Generation**: Automated code generation tools improve developer productivity and maintain consistency.

## Getting Started

1. Install dependencies: `pnpm install  `

2. Generate TypeScript interfaces from Protocol Buffers: `pnpm run generate:proto  `

3. Start the API Gateway: `pnpm run start:gateway  `

4. Start individual microservices (implement as needed).

## Development Workflow

1. Define new services or methods in the appropriate `.proto` file.
2. Run the proto generator to create TypeScript interfaces.
3. Implement the service logic in the corresponding microservice.
4. Update the API Gateway to proxy requests to the new service.

## Best Practices for Extending the Architecture

1. **New Microservices**: When creating a new microservice, follow the existing structure and use the shared libraries.
2. **Database Operations**: Extend the `BaseRepository` for new entity types as needed.
3. **Error Handling**: Use the `ApplicationException` class for custom errors and add new error messages to the shared constants.
4. **DTOs**: Define DTOs in the shared kernel for data structures used across multiple services.
5. **Testing**: Write unit tests for individual components and integration tests for API endpoints.

By following these principles and best practices, you can maintain a scalable, maintainable, and efficient microservices architecture.
