# 🏠 HOA Management System

A comprehensive web application for Homeowners' Association (HOA) management built with Django REST Framework and React.

## 📋 Quick Setup Checklist

Follow this checklist to set up your project:

### ✅ Step 1: Project Structure Setup
```bash
mkdir hoa-management-system
cd hoa-management-system

# Create directory structure
mkdir -p backend/{apps,hoa_backend}
mkdir -p frontend/{src,public}
mkdir -p nginx scripts

# Backend app directories
mkdir -p backend/apps/{users,news,events,documents,bookings,payments,tickets,forum,polls,cms}

# Frontend subdirectories
mkdir -p frontend/src/{components,pages,services,context,hooks,utils,styles}
mkdir -p frontend/src/components/{common,forms,layout}
mkdir -p frontend/src/pages/{Public,Private,Admin}

# Add __init__.py files to make Python packages
touch backend/apps/__init__.py
touch backend/hoa_backend/__init__.py
for app in users news events documents bookings payments tickets forum polls cms; do
    touch backend/apps/$app/__init__.py
done
```

### ✅ Step 2: Copy Configuration Files
Copy the following files from the artifacts provided:

**Root Directory:**
- [ ] `docker-compose.yml`
- [ ] `.env.example` → copy to `.env` and update values
- [ ] `.gitignore`
- [ ] `README.md` (this file)

**Backend Files:**
- [ ] `backend/Dockerfile`
- [ ] `backend/requirements.txt`
- [ ] `backend/.env`
- [ ] `backend/manage.py`
- [ ] `backend/hoa_backend/settings.py`
- [ ] `backend/hoa_backend/urls.py`
- [ ] `backend/hoa_backend/wsgi.py`
- [ ] `backend/hoa_backend/asgi.py`

**Frontend Files:**
- [ ] `frontend/package.json`
- [ ] `frontend/vite.config.js`
- [ ] `frontend/tailwind.config.js`
- [ ] `frontend/postcss.config.js`
- [ ] `frontend/Dockerfile`
- [ ] `frontend/.env`
- [ ] `frontend/public/index.html`
- [ ] `frontend/src/main.jsx`
- [ ] `frontend/src/App.jsx`
- [ ] `frontend/src/router.jsx`

**Nginx & Scripts:**
- [ ] `nginx/nginx.conf`
- [ ] `nginx/Dockerfile`
- [ ] `scripts/setup.sh`
- [ ] `scripts/deploy.sh`

### ✅ Step 3: Set File Permissions
```bash
chmod +x scripts/setup.sh
chmod +x scripts/deploy.sh
```

### ✅ Step 4: Update Environment Variables
Edit `.env` file with your configuration:
```bash
cp .env.example .env
# Edit .env with your values
```

### ✅ Step 5: Run Setup Script
```bash
./scripts/setup.sh
```

## 🚀 Features

### 🔓 Public Features
- Community information and news
- Board member directory
- Event calendar
- Document access (rules & regulations)
- Contact information
- User registration and authentication

### 🔒 Member Features
- Personal dashboard
- Full news and announcements with attachments
- Event RSVP system
- HOA dues payment portal
- Payment history and receipts
- Facility booking system
- Maintenance request submission
- Community forum
- Resident directory
- Polls and surveys
- Profile management

### 🔒 Admin Features
- Administrative dashboard
- User management and role assignment
- Content management (news, events, documents)
- Booking management and approval
- Payment tracking and reporting
- Ticket management and resolution
- Forum moderation
- Poll creation and management
- Data export capabilities

## 🛠️ Technology Stack

- **Backend**: Python 3.11+, Django 4.x, Django REST Framework
- **Frontend**: React 18, Vite, Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT (SimpleJWT)
- **Deployment**: Docker, Nginx, Gunicorn

## 📁 Project Structure

```
hoa-management-system/
├── backend/                 # Django backend
│   ├── apps/               # Django applications
│   │   ├── users/          # User management & authentication
│   │   ├── news/           # News & announcements
│   │   ├── events/         # Event management & RSVP
│   │   ├── documents/      # Document management
│   │   ├── bookings/       # Facility booking system
│   │   ├── payments/       # Payment processing
│   │   ├── tickets/        # Support ticket system
│   │   ├── forum/          # Community forum
│   │   ├── polls/          # Surveys & polls
│   │   └── cms/            # Content management
│   ├── hoa_backend/        # Django project settings
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Docker configuration
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── styles/         # CSS styles
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile         # Docker configuration
├── nginx/                  # Nginx reverse proxy
├── scripts/               # Utility scripts
└── docker-compose.yml     # Multi-container setup
```

## 🔧 Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

## 🌐 Access Points

After setup:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/swagger

## 🔐 Sample Login Credentials

After running the seed script:
- **Admin**: admin@hoa.com / admin123
- **Board Member**: president@hoa.com / password123
- **Resident**: resident1@example.com / password123

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   docker-compose down
   # Or change ports in docker-compose.yml
   ```

2. **Database Connection Error**
   ```bash
   # Check if database is running
   docker-compose logs db
   # Restart database
   docker-compose restart db
   ```

3. **Permission Denied on Scripts**
   ```bash
   chmod +x scripts/setup.sh
   chmod +x scripts/deploy.sh
   ```

4. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## 📦 Production Deployment

1. Update environment variables for production
2. Set up SSL certificates
3. Configure domain name
4. Run deployment script:
   ```bash
   ./scripts/deploy.sh production
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the troubleshooting section
- Review API documentation at `/swagger/`
- Create an issue for bugs or feature requests

---

**⚠️ Important Notes:**

1. **File Creation Order**: Create files in the order specified in the setup guide
2. **Environment Variables**: Always update `.env` before running
3. **Permissions**: Make scripts executable with `chmod +x`
4. **Python Packages**: Add `__init__.py` files to all Python directories
5. **Docker**: Ensure Docker and Docker Compose are installed

**🎯 Next Steps After Setup:**

1. Customize the branding and styling
2. Add your community-specific content
3. Configure email settings for notifications
4. Set up backup procedures
5. Configure monitoring and logging