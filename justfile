# Automatically load environment variables from root .env
set dotenv-load

# List available recipes by default when running `just`
default:
    @just --list

# Run local Docker environment with hot-reloading (watch mode)
dev:
    docker --context default compose -f compose.dev.yaml up --build --watch

# Stop local dev containers
down:
    docker --context default compose -f compose.dev.yaml down

# Run production build locally
prod-local:
    docker --context default compose up --build

# View logs for a service (e.g., `just logs web` or `just logs`)
logs *service:
    docker --context default compose -f compose.dev.yaml logs -f {{service}}
