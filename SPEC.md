# Intelligent Diagnosis and Symptom Analysis System - SPEC.md

## Project Overview
**Project Name:** HealthAI - Intelligent Diagnosis & Symptom Analysis System
**Type:** Full-stack Web Application (Healthcare AI Platform)
**Core Functionality:** AI-powered early-warning health assistant that predicts health risks from symptoms, lifestyle patterns, and basic health data with personalized preventive recommendations.
**Target Users:** General public seeking proactive health insights, healthcare-conscious individuals

---

## Technology Stack Selection

### Frontend
- **Framework:** React 18 with Vite (fast build, modern DX)
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Custom components inspired by Shadcn/Radix
- **State Management:** React Context + Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcrypt
- **Validation:** Joi/Zod

### AI Service (Python)
- **Framework:** FastAPI (modern Python web framework)
- **ML Library:** scikit-learn, pandas
- **LLM Integration:** OpenAI API (for health insights)
- **Symptom Analysis:** Rule-based + ML hybrid

### DevOps
- **Containerization:** Docker + Docker Compose
- **Deployment:** Render/Railway (free tier friendly)

---

## UI/UX Specification

### Design System

#### Color Palette
- **Primary:** `#0D9488` (Teal - trust, health, calm)
- **Primary Dark:** `#0F766E`
- **Primary Light:** `#5EEAD4`
- **Secondary:** `#6366F1` (Indigo - technology, AI)
- **Accent:** `#F59E0B` (Amber - attention, warnings)
- **Danger:** `#EF4444` (Red - high risk)
- **Warning:** `#F59E0B` (Amber - medium risk)
- **Success:** `#10B981` (Green - low risk, healthy)
- **Background:** `#F8FAFC` (Light gray-blue)
- **Surface:** `#FFFFFF`
- **Text Primary:** `#1E293B`
- **Text Secondary:** `#64748B`

#### Typography
- **Font Family:** 
  - Headings: "Plus Jakarta Sans" (modern, geometric)
  - Body: "Inter" (highly readable)
- **Font Sizes:**
  - H1: 48px / 3rem
  - H2: 36px / 2.25rem
  - H3: 24px / 1.5rem
  - H4: 20px / 1.25rem
  - Body: 16px / 1rem
  - Small: 14px / 0.875rem

#### Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

#### Visual Effects
- Border radius: 8px (cards), 12px (buttons), 16px (modals)
- Shadows: 
  - Card: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
  - Elevated: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- Transitions: 200ms ease-in-out

---

### Layout Structure

#### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

#### Page Structure
1. **Navigation Bar** (fixed top)
   - Logo (left)
   - Nav links (center): Dashboard, Analyze, History, Settings
   - User menu (right): Profile, Logout

2. **Main Content Area**
   - Max width: 1280px
   - Padding: 24px (mobile), 48px (desktop)
   - Centered with auto margins

3. **Footer**
   - Minimal, with links and copyright

---

### Pages & Components

#### 1. Landing Page (Public)
- Hero section with animated health illustration
- Features grid (3 columns)
- How it works (3 steps)
- Testimonials
- CTA buttons

#### 2. Authentication Pages
- Login form (email/password)
- Register form (name, email, password, confirm)
- Forgot password flow
- Clean, centered card design

#### 3. Dashboard (Authenticated)
- Welcome header with user name
- Health score summary card
- Recent analyses grid
- Quick actions panel
- Health tips carousel

#### 4. Symptom Analysis Page
- Multi-step wizard:
  - Step 1: Basic Info (age, gender, weight, height)
  - Step 2: Symptoms Selection (searchable chips)
  - Step 3: Duration & Severity
  - Step 4: Lifestyle Factors
  - Step 5: Review & Analyze
- Progress indicator
- Animated transitions

#### 5. Results Page
- Risk assessment gauge (animated)
- Condition predictions with probabilities
- Personalized recommendations
- Action items
- Share/Download options

#### 6. History Page
- Timeline view of past analyses
- Filterable by date/risk level
- Detail expansion

#### 7. Profile/Settings
- Edit profile form
- Notification preferences
- Account settings

---

## Functionality Specification

### Core Features

#### 1. User Authentication
- JWT-based authentication
- Secure password hashing
- Session management
- Profile CRUD

#### 2. Symptom Input System
- Searchable symptom database (100+ symptoms)
- Multi-select with auto-complete
- Duration picker
- Severity slider (1-10)
- Body region selector

#### 3. AI Analysis Engine
- Symptom pattern matching
- Risk prediction model (random forest classifier)
- Confidence scoring
- Multiple condition predictions

#### 4. Health Insights (LLM)
- Personalized explanations
- Preventive recommendations
- Lifestyle modification tips
- When-to-see-doctor alerts

#### 5. Health Score System
- 0-100 scale
- Based on multiple factors
- Historical tracking
- Visual gauge display

#### 6. History & Tracking
- Save all analyses
- Compare past results
- Track health trends

---

## API Structure

### REST Endpoints

#### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

#### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`

#### Analysis
- `POST /api/analysis/analyze`
- `GET /api/analysis/history`
- `GET /api/analysis/:id`

#### Health Data
- `POST /api/health/metrics`
- `GET /api/health/metrics`
- `GET /api/health/score`

---

## Database Schema

### User Model
```
javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Analysis Model
```
javascript
{
  userId: ObjectId,
  symptoms: Array,
  duration: String,
  severity: Number,
  lifestyle: Object,
  riskLevel: String,
  conditions: Array,
  recommendations: Array,
  healthScore: Number,
  createdAt: Date
}
```

---

## Hackathon Winning Features

### 1. Real-time Risk Gauge
- Animated circular progress
- Color-coded risk levels
- Instant visual feedback

### 2. AI Chat Assistant
- Symptom-related Q&A
- Health tips chatbot
- Natural language interface

### 3. Health Score Trends
- Interactive charts
- Historical data visualization
- Improvement tracking

### 4. Emergency Alerts
- Red flag symptom detection
- "Seek Immediate Care" warnings
- Emergency contacts

### 5. Shareable Reports
- PDF generation
- Share to social media
- Email results

---

## Demo Flow (3-5 Minutes)

1. **Intro (30s):** Present the problem - people ignore early health warning signs
2. **Live Demo (2min):**
   - Show landing page
   - Register new account
   - Complete symptom wizard
   - Show AI analysis in action
3. **Features Showcase (1min):** Highlight 3 key features
4. **Tech Stack (30s):** Briefly explain the architecture
5. **Closing (30s):** Summary and future vision

---

## File Structure

```
healthai/
├── frontend/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
│
├── ai-service/               # Python AI service
│   ├── src/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

---

## Deployment Plan

### Development (Local)
1. Install dependencies
2. Start MongoDB
3. Run backend: `npm run dev`
4. Run AI service: `python src/main.py`
5. Run frontend: `npm run dev`

### Production
1. **Frontend:** Deploy to Vercel/Netlify
2. **Backend:** Deploy to Railway/Render
3. **AI Service:** Deploy to Railway/Render with Python support
4. **Database:** MongoDB Atlas (free tier)
5. **Environment Variables:** Configure in hosting platforms

---

## Acceptance Criteria

- [ ] Landing page loads with animations
- [ ] User can register and login
- [ ] Symptom wizard completes all steps
- [ ] Analysis returns risk assessment
- [ ] Results page shows visual gauge
- [ ] History saves and displays past analyses
- [ ] Responsive on mobile/tablet/desktop
- [ ] API endpoints return proper responses
- [ ] AI service processes symptom data
- [ ] Application is deployable
