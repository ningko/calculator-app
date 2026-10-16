# build react app
FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# build go binary
FROM golang:1.25-alpine AS backend
WORKDIR /backend
COPY backend/ ./
RUN CGO_ENABLED=0 go build -o server .

#image
FROM alpine:3.20
WORKDIR /app
COPY --from=backend /backend/server ./server
COPY --from=frontend /frontend/dist ./static
EXPOSE 8080
CMD ["./server"]