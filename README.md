Employee Management System (EMS)
A basic Employee Management System built with Django and React (Vite). This is a learning project, not production-ready, and intended to practice full-stack development concepts including authentication, role-based permissions, and CRUD operations.

Features
Role-based access:

Admin

HR

Employee

Attendance management:

Manual check-in/check-out

QR code-based attendance (prototype)

Leave request and response system

Simple payroll calculator based on attendance records

JWT-based authentication (SimpleJWT)

Tech Stack
Backend: Django, Django REST Framework

Frontend: React (Vite), Axios, Tailwind CSS

Authentication: SimpleJWT

QR Code: qrcode Python package

Getting Started
Prerequisites
Python 3.11+

Node.js 18+

npm or yarn

Backend Setup
bash
Copy
Edit
cd backend
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Your backend requires a .env file in the backend/ directory with:

ini
Copy
Edit
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Current Limitations
Not stable or production-ready

Basic error handling

Minimal test coverage

QR code attendance is incomplete

Feedback
This is an ongoing learning project. Suggestions and constructive criticism on code structure, feature improvements, or better practices are welcome.
