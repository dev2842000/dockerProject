### Docker-Compose Setup
This project utilizes Docker Compose to orchestrate the deployment of a multi-service environment comprising MySQL, an Express backend, and a Next.js frontend. Below is a summary of the services and configurations.

## MySQL Service
* Image: mysql:8.0
* Environment Variables:
    * MYSQL_ROOT_PASSWORD: Root password for the MySQL instance
    * MYSQL_DATABASE: Name of the database to create
* Port Mapping:
    * Host: 3307 → Container: 3306
* Volumes:
    * Volume: mysql-data for persistent data storage
* Health Check:
    * Ensures the MySQL service is fully operational before other services start.


## Backend Service (Express)
* Build Context: server directory
* Environment Variables:
    * DB_HOST: Hostname for the MySQL database
    * DB_USER: MySQL user
    * DB_PASSWORD: MySQL password
    * DB_NAME: Database name
    * PORT: Port on which the Express server will run
* Port Mapping:
    * Host: 5000 → Container: 5000
* Dependencies:
    * Waits for the MySQL service to be healthy before starting.


## Frontend Service (Next.js)
* Build Context: client directory
* Environment Variables:
    * NEXT_PUBLIC_API_URL: URL for the backend API
* Port Mapping:
    * Host: 3000 → Container: 3000

## Volumes
* Named Volume: mysql-data for storing MySQL data persistently across container restarts.


## Getting Started:
1. Clone the Repository:
    - git clone https://github.com/dev2842000/dockerProject.git
    - cd dockerProject

2. Ensure Docker and Docker Compose are installed.

3. Build and Start Services:

    * Run the following command from the root of your project directory:
        - docker-compose up --build
        
    * This command will build the Docker images for the backend and frontend services and start all three services (MySQL, backend, and frontend).

4. Accessing Services:

    * MySQL Database: Accessible at localhost:3307
    * Backend API: Accessible at localhost:5000
    * Frontend Application: Accessible at localhost:3000

5. Stopping Services:
    * To stop and remove the running containers, use:
        - docker-compose down

## Notes

* Ensure that the environment variables for MySQL are set correctly in the docker-compose.yml file.
* Check the .env files in the server and client directories to configure other environment variables as needed.
