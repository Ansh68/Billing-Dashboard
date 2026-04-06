# LogiEdge Billing Dashboard

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: PostgreSQL (Prisma ORM)

## Features
- Customer & Item Management
- Invoice Generation with GST Logic
- Dashboard with Invoice Search
- Unique Invoice ID Generation

## Setup Instructions

### Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

### Frontend
cd frontend
npm install
npm start

## Environment Variables

Create `.env` in backend:

DATABASE_URL=your_postgresql_url
