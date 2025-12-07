Home Library Service using NestJS, PostgreSQL, Prisma and Docker.

Clone the repository:
git clone https://github.com/quoralis/nodejs2025Q2-service
cd nodejs2025Q2-service

Create .env file:
DATABASE_URL=postgresql://St:123456@postgres:5432/home_library?schema=public
PORT=4000

Start with Docker:
docker compose up -d --build

Apply Prisma migrations:
docker exec -it home-lib-app npx prisma migrate deploy

Open API:
http://localhost:4000

Docker Hub images:
docker pull quoralis/home-library-app:latest
docker pull quoralis/home-library-db:latest
