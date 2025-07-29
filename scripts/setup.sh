#!/bin/bash

echo "🏠 HOA Management System Setup Script"
echo "====================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Build and start containers
echo "🔨 Building Docker containers..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for database to start
echo "⏳ Waiting for database to start..."
sleep 10

# Run migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Create superuser (optional)
read -p "🔑 Do you want to create a superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose exec backend python manage.py createsuperuser
fi

# Load sample data
read -p "📊 Do you want to load sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Loading sample data..."
    docker-compose exec -T backend python manage.py shell < scripts/seed_data.py
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api"
echo "   Admin Panel: http://localhost:8000/admin"
echo "   API Docs: http://localhost:8000/swagger"
echo ""
echo "🔐 Sample login credentials (if sample data was loaded):"
echo "   Admin: admin@hoa.com / admin123"
echo "   Member: resident1@example.com / password123"
echo ""
echo "To stop the application: docker-compose down"
echo "To view logs: docker-compose logs -f"