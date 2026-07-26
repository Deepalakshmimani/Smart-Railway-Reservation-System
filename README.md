# Smart Train Ticket Booking System

A full-stack Train Ticket Booking System developed using React.js, Node.js, Express.js, MySQL, and Python. The application provides secure user authentication, train search, seat booking, payment processing, ticket cancellation, waiting list management, AI-powered train recommendations, and an AI chatbot for customer assistance.

The backend follows the MVC architecture and implements database transactions, row-level locking, and concurrency control to ensure data consistency during simultaneous booking requests.

---

# Features

## User Features

- User Registration & Login
- JWT Authentication
- Train Search
- Train Schedule & Seat Availability
- Coach Selection
- Seat Selection
- Passenger Management
- Ticket Booking
- Booking History
- Ticket Cancellation
- Reward Credits
- Notification System
- PDF Ticket Generation
- AI Chatbot
- Dashboard & Analytics

---

## Admin Features

- Admin Authentication
- Train Management
- Station Management
- Coach Template Management
- Schedule Management
- Booking Management


---

# AI Features

- AI Train Recommendation System (Python)
- AI Chatbot using Dify
- Knowledge Base Integration
- Intelligent Train Search Assistance
- Recommendation API Integration

---

# Advanced Backend Concepts

- MVC Architecture
- REST API Development
- JWT Authentication
- HTTP-only Cookies
- Middleware-based Authorization
- Database Transactions
- ACID Compliance
- Row-level Locking (`SELECT ... FOR UPDATE`)
- Concurrent Booking Handling
- Seat Locking Mechanism
- Waiting List Automation
- Payment Expiry Handling
- Automatic Seat Release using Cron Jobs
- Refund Workflow
- Email Notifications
- Modular Service Architecture
- Error Handling Middleware

---

# Technology Stack

## Frontend

- React.js
- React Router DOM
- Axios
- React Hot Toast
- React Markdown
- Recharts

---

## Backend

- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs
- Cookie Parser
- Multer
- Nodemailer
- node-cron
- Axios
- PDFKit


---

## AI Services

- Python
- Pandas
- NumPy
- Scikit-learn
- Dify AI
- Gemini API

---

## Database

- MySQL

---

# Project Structure

```
Train-Ticket-Booking
│
├── client/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── workers/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── recommendation-service/
│   ├── app.py
│   ├── recommendation.py
│   ├── requirements.txt
│   └── model/
│
└── README.md
```

---

# Prerequisites

Install the following software before running the project.

- Git
- Node.js (18+)
- MySQL Server
- Python 3.10+
- pip

---

# Clone Repository

```bash
git clone https://github.com/Deepalakshmimani/Smart-Railway-Reversation-System

cd Smart-Railway-Reversation-System
```

---

# Backend Setup

```bash
cd server

npm install
```

Create a `.env`

```env
PORT=4000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=train_ticket

JWT_SECRET=your_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password


DIFY_API_KEY=your_key
```

Run

```bash
npm start
```

or

```bash
npm run dev
```

Backend

```
http://localhost:4000
```

---

# Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# Python Recommendation Service

Navigate to the recommendation service.

```bash
cd recommendation-service
```

Create a virtual environment.

Windows

```bash
python -m venv venv

venv\Scripts\activate
```

Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

Install Python dependencies.

```bash
pip install -r requirements.txt
```

Run the service.

```bash
python app.py
```

or

```bash
uvicorn app:app --reload
```

Service URL

```
http://localhost:5000
```

---

# Database Setup

Create the database.

```sql
CREATE DATABASE train_ticket;
```

Import

```
database/train_ticket.sql
```

---

# Backend Dependencies

```
express
mysql2
jsonwebtoken
bcryptjs
cookie-parser
cors
dotenv
multer
nodemailer
node-cron
axios
pdfkit
stripe
uuid
express-validator
```

---

# Frontend Dependencies

```
react
react-dom
react-router-dom
axios
react-hot-toast
react-markdown
recharts
vite
```

---

# Python Dependencies

```
uvicorn
pandas
numpy
scikit-learn
joblib
mysql-connector-python
python-dotenv
requests
```


---

# Running the Complete Application

### Terminal 1

```bash
cd server

npm install

npm start
```

---

### Terminal 2

```bash
cd client

npm install

npm run dev
```

---

### Terminal 3

```bash
cd recommendation-service

pip install -r requirements.txt

python app.py
```

---

Open

```
Frontend:
http://localhost:5173

Backend:
http://localhost:4000

```

---

# Future Enhancements

- Dynamic Pricing
- Demand Forecasting
- Occupancy Prediction
- Smart Seat Recommendation
- Multi-language AI Assistant

---

# License

This project is developed for educational purposes.
