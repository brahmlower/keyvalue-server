
# KeyValue Server

This is a small project for storing and serving in memory key-value data.

## Development

### Backend

The backend assumes go version 1.17.x or later. The "build" and "test" sections assume your current working direction is the `backend` directory.

#### Building

You can build the binary using `go build`:

```
go build -o bin/main main.go
```

Or build and run the binary in a single command using `go run`:

```
go run main.go
```

(note that this doesn't auto-compile & restart when source files change like the frontend)

There is also a makefile with the targets `build` and `run` respectively for added convenience.

#### Tests

Run tests with a coverage profile so we can generate a report afterward

```
go test -coverprofile=coverage.out
```

View the report:

```
go tool cover -html=coverage.out
```

### Frontend

The frontend uses react 17 with typescript 4, and tailwindcss 3. The "build" section assumes your current working direction is the `frontend` directory.

#### Building

Install dependencies:

```
npm install
```

Run in development mode (this will watch for local changes and reload the app as needed)

```
npm run start
```

## Running locally

Frontend and backend artifacts are run locally using docker images. Building the
images and starting the containers is made easier with the `docker-compose.yml` file
in the top of this project.

To get started, build the images:

```
docker compose build backend
docker compose build frontend
```

Then start the services:

```
docker compose start backend
docker compose start frontend
```

Then view the webclient at http://localhost:3000. The API is accessible at http://localhost:3001.
