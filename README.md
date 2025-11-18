# HireCards - Transform Hiring into Smart Battle Cards

A modern, full-stack Next.js 15 application that transforms a short hiring intake form into a comprehensive "Battle Card Deck", a set of smart cards that explain a job role from every perspective.

## 🚀 Features

- **Intelligent Form Processing**: Quick 2-minute intake form that captures all essential hiring information
- **8+ Card Types**: 
  - Role Definition
  - Compensation Intelligence
  - Market Insights
  - Requirements & Skills
  - Responsibilities
  - Culture Fit
  - Recruiting Messaging
  - Interview Guide

- **Premium UI/UX**: Clean, modern design inspired by leading HR tech platforms
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Interactive Cards**: Expandable battle cards with smooth animations
- **Export & Share**: Download and share your battle card decks

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Getting Started

1. Visit the homepage at `http://localhost:3000`
2. Click "Get Started" or navigate to `/create`
3. Fill out the hiring intake form (takes ~2 minutes)
4. View your generated battle card deck at `/results`
5. Download or share your cards

## 📁 Project Structure

```
hirecards/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── create/
│   │   └── page.tsx        # Intake form page
│   ├── results/
│   │   └── page.tsx        # Results display page
│   └── api/
│       └── generate-cards/
│           └── route.ts    # API endpoint for card generation
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── Features.tsx        # Features showcase
│   ├── HowItWorks.tsx      # Process explanation
│   ├── BattleCardPreview.tsx # Interactive preview
│   ├── Testimonials.tsx    # Customer testimonials
│   ├── CTA.tsx             # Call-to-action section
│   ├── Footer.tsx          # Footer
│   ├── IntakeForm.tsx      # Hiring intake form
│   └── BattleCard.tsx      # Individual card component
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎨 Design Philosophy

The design follows these principles:
- **Clean & Modern**: Minimalist interface with focus on content
- **Fast & Responsive**: Optimized performance and smooth animations
- **Premium Feel**: Gradient accents, subtle shadows, and polished interactions
- **User-Centric**: Intuitive flow from intake to insights

## 🔧 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { ... },
  secondary: { ... },
}
```

### Card Types
Add or modify card types in `app/api/generate-cards/route.ts` in the `generateBattleCards` function.

## 📝 API Endpoints

### POST `/api/generate-cards`
Generates battle cards from intake form data.

**Request Body:**
```json
{
  "jobTitle": "Senior Product Manager",
  "department": "Product",
  "experienceLevel": "Senior",
  "location": "San Francisco, CA",
  "salaryRange": "$140k - $180k",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "cards": [...],
  "sessionId": "session_abc123"
}
```

## 🚢 Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js:

```bash
# Deploy to Vercel
vercel

# Or build and deploy elsewhere
npm run build
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15 and TailwindCSS
