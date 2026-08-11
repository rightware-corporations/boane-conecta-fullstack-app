# Deployment Guide

This document provides guidance on deploying the Boane Conecta full-stack application, covering local development with Docker Compose and conceptual considerations for production environments.

## Local Docker Deployment

For local development, the application is designed to be easily set up using Docker Compose. This provides a consistent environment for both the backend and the PostgreSQL database.

### Prerequisites

*   Docker Desktop (or Docker Engine and Docker Compose) installed.
*   Git installed.

### Steps to Run

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd boane-conecta-fullstack
    ```

2.  **Configure Environment Variables:**
    Copy the example environment file and customize it if needed. The `docker-compose.yml` file will pick up these variables.
    ```bash
    cp .env.example .env
    ```

3.  **Start the services:**
    Navigate to the root of the `boane-conecta-fullstack` directory and run:
    ```bash
    docker-compose up --build
    ```
    This command will:
    *   Build the backend Docker image (if not already built or if changes are detected).
    *   Start a PostgreSQL database container.
    *   Start the backend application container, which will automatically run Flyway migrations and seed initial data.

4.  **Access the applications:**
    *   **Backend API:** `http://localhost:8080/api/v1/health` (or the port configured in `.env`)
    *   **Frontend:** The frontend is served separately. Navigate to the `frontend` directory and run `npm install && npm run dev` (or equivalent) to start it, typically on `http://localhost:5173`.

### Stopping the services

To stop and remove the containers, networks, and volumes created by `docker-compose up`:

```bash
docker-compose down -v
```

## Production Deployment Concept

For production environments, a more robust and scalable deployment strategy is recommended. While the current setup is a modular monolith, the containerized nature allows for flexible deployment options.

### Key Considerations

*   **Container Orchestration:** Use platforms like Kubernetes, Docker Swarm, or cloud-managed container services (e.g., AWS ECS, Google Kubernetes Engine, Azure Kubernetes Service) for managing and scaling containers.
*   **Database Management:** Utilize managed database services (e.g., AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL) for high availability, backups, and easier maintenance. Avoid running the database directly in a container on the application server in production.
*   **Secrets Management:** Never hardcode sensitive information. Use dedicated secrets management services (e.g., AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets) to securely store and inject environment variables like `JWT_SECRET` and database credentials.
*   **Monitoring and Logging:** Implement comprehensive monitoring (e.g., Prometheus, Grafana) and centralized logging (e.g., ELK stack, Splunk) to track application performance, health, and troubleshoot issues.
*   **CI/CD Pipeline:** Automate the build, test, and deployment process using Continuous Integration/Continuous Delivery (CI/CD) pipelines (e.g., Jenkins, GitLab CI, GitHub Actions).

## Database Backup Notes

Regular database backups are critical for disaster recovery. For a PostgreSQL database, consider:

*   **Logical Backups:** Using `pg_dump` to create SQL dumps of your database. These can be restored to any PostgreSQL instance.
*   **Physical Backups:** Using file system level backups or tools like `pg_basebackup` for larger databases, often combined with Point-in-Time Recovery (PITR).
*   **Managed Service Backups:** If using a managed database service, leverage its built-in automated backup and restore functionalities.

## Environment Variables

In production, environment variables should be managed securely and injected into the application containers. The `.env.example` file serves as a template for required variables. Do not commit `.env` files with production secrets to version control.

## Reverse Proxy Suggestion

It is highly recommended to place a reverse proxy (e.g., Nginx, Apache HTTP Server) in front of the backend and frontend applications in production. A reverse proxy can handle:

*   **SSL/TLS Termination:** Encrypting traffic between clients and your server.
*   **Load Balancing:** Distributing incoming traffic across multiple instances of your backend application.
*   **Static File Serving:** Efficiently serving frontend static assets.
*   **API Gateway Functionality:** Routing requests to the appropriate backend services.
*   **Security:** Providing an additional layer of security, including WAF (Web Application Firewall) capabilities and rate limiting.
