echo "🚀 HOA Management System Deployment Script"
echo "=========================================="

# Set deployment environment
ENVIRONMENT=${1:-production}
echo "📍 Deploying to: $ENVIRONMENT"

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Check if required files exist
required_files=(".env" "docker-compose.yml")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file $file not found"
        exit 1
    fi
done

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# Build production images
echo "🔨 Building production images..."
docker-compose -f docker-compose.yml build --no-cache

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start new containers
echo "🚀 Starting new containers..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Run migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Collect static files
echo "📦 Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

# Run health checks
echo "🏥 Running health checks..."
backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/users/profile/ || echo "000")
frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")

if [ "$backend_health" != "401" ] && [ "$backend_health" != "200" ]; then
    echo "❌ Backend health check failed (HTTP $backend_health)"
    exit 1
fi

if [ "$frontend_health" != "200" ]; then
    echo "❌ Frontend health check failed (HTTP $frontend_health)"
    exit 1
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api"
echo "   Admin Panel: http://localhost:8000/admin"
echo ""
echo "📊 To monitor logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"