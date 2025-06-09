Employee Management System (EMS)
A basic Employee Management System built with Django and React (Vite). This project serves as a full-stack learning exercise, covering authentication, role-based access control, CRUD operations, and attendance management.

Features
Role-Based Access

Admin

HR

Employee

Attendance Management

Manual check-in/check-out

Prototype QR code-based attendance

Leave Management

Request and approval system

Payroll

Simple calculator based on attendance records

Authentication

JWT-based (SimpleJWT)

Tech Stack
Backend: Django, Django REST Framework

Frontend: React (Vite), Axios, Tailwind CSS

Authentication: SimpleJWT

QR Codes: qrcode Python package

Quick Start
Backend


cd backend
python -m venv env
source env/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Create a .env file in backend/:

SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

Frontend


cd frontend
npm install
npm run dev

Known Limitations
Not production-ready

Basic error handling

Minimal test coverage

Incomplete QR code attendance workflow

Feedback
Open to feedback on code structure, feature improvements, or better practices — contributions and suggestions are welcome.
