# FocusDesk

A modern productivity dashboard powered by AI for managing tasks and tracking your daily goals. Built with **Next.js**, **React**, **Supabase**, **TypeScript**, and **AI Integration**.

## 📋 Overview

FocusDesk is your personal productivity hub powered by artificial intelligence. Manage tasks effortlessly with an intuitive kanban board, get intelligent task suggestions, track your progress with smart metrics, and stay motivated with daily streaks. The AI learns your work patterns to help you stay focused and productive.

## ✨ Features

- **AI-Powered Task Management** - Get intelligent suggestions and task optimization
- **Drag & Drop Interface** - Seamlessly move tasks between Todo, In Progress, and Done columns
- **Smart Metrics** - AI-calculated completion rates, task predictions, and productivity insights
- **AI Assistant** - Get help organizing tasks and improving productivity
- **User Authentication** - Secure login with Supabase
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode Support** - Built-in dark theme

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd fcus
```

2. Install dependencies

```bash
pnpm install
```

3. Create `.env.local` file

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (dashboard)/        # Dashboard layout group
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/            # React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── tasks-list.tsx    # Kanban board component
│   ├── app-sidebar.tsx   # Navigation sidebar
│   └── ...
├── utils/                # Utility functions
│   └── supabase/         # Supabase client & server utilities
└── styles/               # Global styles
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI / Claude API (Task suggestions & optimization)
- **State Management**: React Hooks
- **Drag & Drop**: Native HTML5 Drag & Drop API

## 📝 Usage

1. **Sign Up/Login** - Create an account or login with Supabase
2. **Add Tasks** - Create new tasks through the dashboard
3. **Organize Tasks** - Drag and drop tasks between columns
4. **Track Progress** - View your completion metrics and streaks
5. **Sign Out** - Logout safely from the sidebar

## 🎨 Customization

- **Colors & Theme**: Edit Tailwind configuration in `tailwind.config.js`
- **UI Components**: Located in `/components/ui/`
- **Dashboard Layout**: Modify `/app/(dashboard)/dashboard/`

## 📦 Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Format code
pnpm format

# Lint code
pnpm lint
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Happy focusing! 🎯**
