# Install dependencies for both backend and frontend
install:
	@echo "Installing backend dependencies..."
	pip install -r backend/requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Start development environment
dev:
	@echo "Starting development environment..."
	./scripts/dev.sh

# Build the frontend for production
build:
	@echo "Building frontend for production..."
	cd frontend && npm run build

# Start Docker containers
docker-up:
	@echo "Starting Docker containers..."
	docker-compose up --build -d

# Stop Docker containers
docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down

# Run tests for backend and frontend
test:
	@echo "Running backend tests..."
	pytest backend/tests
	@echo "Running frontend tests..."
	cd frontend && npm test

# Clean up generated files and Docker containers
clean:
	@echo "Cleaning up..."
	rm -rf backend/__pycache__
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	docker-compose down -v