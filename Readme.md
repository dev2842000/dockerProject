Docker-Compose Summary:

## MySQL Service:

- Uses the MySQL 8.0 image.
- Sets environment variables for root password and database name.
- Maps port 3307 on the host to port 3306 in the container.
- Uses a named volume mysql-data for persistent storage.
- Includes a health check to ensure the MySQL service is up and running.

## Backend Service (Express):

- Builds the Docker image from the server directory.
- Sets environment variables for database connection and server port.
- Maps port 5000 on the host to port 5000 in the container.
- Depends on the MySQL service and waits for it to be healthy before starting.


## Frontend Service (Next.js):

- Builds the Docker image from the client directory.
- Sets an environment variable for the API URL.
- Maps port 3000 on the host to port 3000 in the container.


## Volumes:

- Defines a named volume mysql-data for MySQL data storage.