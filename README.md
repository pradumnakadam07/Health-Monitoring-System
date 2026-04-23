# HealthAI - Intelligent Diagnosis and Symptom Analysis System

An AI-powered early-warning health assistant that predicts health risks from symptoms, lifestyle patterns, and basic health data with personalized preventive recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Backend Setup (FastAPI)

```
bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on http://localhost:5000

### Frontend Setup (Next.js)

```
bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### Using Docker

```
bash
docker-compose up --build
```

## 📁 Project Structure

```
healthai/
├── backend/              # Python FastAPI
│   ├── main.py          # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   ├── Dockerfile       # Docker build
│   └── render.yaml     # Render deployment config
│
├── frontend/            # Next.js 14
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React context
│   │   └── services/   # API service
│   ├── package.json
│   ├── vercel.json    # Vercel config
│   └── Dockerfile     # Docker build
│
├── docker-compose.yml  # Local development
├── SPEC.md            # Full specification
└── README.md
```

## 🎨 Features

- **AI-Powered Analysis**: Advanced symptom analysis with risk prediction
- **Real-time Health Score**: Live health risk scoring with animated gauges
- **Multi-step Symptom Wizard**: Easy symptom input with severity tracking
- **Lifestyle Integration**: Risk factors from lifestyle choices
- **Emergency Alerts**: Red flag symptom detection
- **History Tracking**: View and manage past analyses
- **Visual Charts**: Health trends with Chart.js
- **Judge Dashboard**: Special endpoint for analytics showcase

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Analysis
- `POST /api/analysis/analyze` - Analyze symptoms
- `GET /api/analysis/history` - Get analysis history
- `GET /api/analysis/:id` - Get specific analysis

### Health
- `GET /api/health/score` - Get health score
- `GET /api/health/trends` - Get health trends
- `GET /api/health/stats` - Get health statistics
- `GET /api/health/realtime-score` - Real-time risk scoring (for judges)
- `GET /api/health/judge-dashboard` - Judge analytics dashboard

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Chart.js
- **Backend**: Python FastAPI, Pydantic
- **Authentication**: JWT tokens

## ☁️ Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings (automatic)
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service in Render
3. Connect to GitHub repository
4. Configure: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

## 📝 License

MIT
