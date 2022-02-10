FROM golang:1.17-alpine

WORKDIR /build

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . ./

RUN go build -o bin/keyvalue-server main.go
RUN mv bin/keyvalue-server /keyvalue-server

CMD ["/keyvalue-server"]
