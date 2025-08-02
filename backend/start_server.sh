# Just run these commands directly in your terminal:

# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment (if you don't have one)
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 4. Install requirements
pip install -r requirements.txt

# 5. Create .env file (copy the content from the artifact above)
# Copy the .env content and save it as backend/.env

# 6. Run migrations
python manage.py migrate

# 7. Create superuser
python manage.py createsuperuser

# 8. Start the server
python manage.py runserver 0.0.0.0:8000