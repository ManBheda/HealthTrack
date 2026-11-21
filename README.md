# HealthTrack

A personal health & wellness tracker built with **React, TypeScript, Vite and Tailwind CSS**. Track your daily habits in one clean dashboard — all data stays in your browser.

## ✨ Features

| Module | What it does |
|---|---|
| 📊 Dashboard | Overview of today's health stats |
| 💧 Water Tracker | Log daily water intake |
| 🍽️ Meal Tracker | Record meals |
| 🏃 Fitness Tracker | Log workouts and activity |
| ⚖️ Weight Tracker | Track weight over time |
| 😴 Sleep Tracker | Log sleep |
| 🙂 Mood Tracker | Record daily mood |
| 📓 Mental Health Journal | Private journaling |
| 🌬️ Breathing Exercise | Guided breathing session |
| 🧘 Stretch Routine | Simple stretching routine |
| ⚙️ Settings | Personalise the app |

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS** (styling)
- **lucide-react** (icons)
- React Context API for state, persisted to `localStorage`

## 🚀 Getting Started

```bash
git clone https://github.com/ManBheda/HealthTrack.git
cd HealthTrack
npm install
npm run dev
```

Then open the local URL shown in the terminal (usually http://localhost:5173).

### Other scripts

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## 📁 Project Structure

```
src/
├── components/   # Feature modules (trackers, journal, dashboard…)
├── context/      # HealthContext – global state + localStorage
├── types/        # TypeScript types (health.ts)
├── App.tsx
└── main.tsx
```

## 🔒 Privacy

No backend and no account — everything is saved locally in your browser.

## 👤 Author

**Man Bheda** — Web Developer & Digital Marketing / SEO Manager
🌐 [manbheda.site](https://www.manbheda.site/) · 💼 [LinkedIn](https://www.linkedin.com/in/man-bheda) · 🐦 [@ManBheda](https://x.com/ManBheda)
