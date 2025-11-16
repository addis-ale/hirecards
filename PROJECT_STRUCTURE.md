# HireCards - Project Structure

## 📂 Complete File Tree

```
hirecards/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes
│   │   └── 📁 generate-cards/
│   │       └── route.ts             # Card generation endpoint
│   │
│   ├── 📁 create/                   # Intake Form Page
│   │   └── page.tsx
│   │
│   ├── 📁 results/                  # Results Display Page
│   │   └── page.tsx
│   │
│   ├── layout.tsx                   # Root Layout (metadata, fonts)
│   ├── page.tsx                     # Homepage
│   └── globals.css                  # Global styles + Tailwind
│
├── 📁 components/                   # React Components
│   ├── Navbar.tsx                   # Navigation bar with scroll detection
│   ├── Hero.tsx                     # Hero section with animations
│   ├── Features.tsx                 # 8 feature cards showcase
│   ├── HowItWorks.tsx              # 3-step process explanation
│   ├── BattleCardPreview.tsx       # Interactive card preview
│   ├── Testimonials.tsx            # Customer testimonials
│   ├── CTA.tsx                     # Call-to-action section
│   ├── Footer.tsx                  # Footer with links
│   ├── IntakeForm.tsx              # Multi-section form
│   └── BattleCard.tsx              # Individual expandable card
│
├── 📁 public/                       # Static assets
│   └── .gitkeep
│
├── 📄 Configuration Files
├── package.json                     # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── .eslintrc.json                  # ESLint rules
├── .gitignore                      # Git ignore patterns
│
└── 📄 Documentation
    ├── README.md                    # Main documentation
    ├── QUICKSTART.md               # Quick start guide
    └── PROJECT_STRUCTURE.md        # This file
```

## 🔍 Detailed Component Breakdown

### Homepage Flow (app/page.tsx)
```
┌─────────────────────────────────────────┐
│            Navbar                       │ ← Fixed top navigation
├─────────────────────────────────────────┤
│            Hero                         │ ← Main headline + CTA
│     (Animated card preview)            │
├─────────────────────────────────────────┤
│           Features                      │ ← 8 feature cards grid
├─────────────────────────────────────────┤
│          HowItWorks                     │ ← 3-step process
├─────────────────────────────────────────┤
│       BattleCardPreview                 │ ← Interactive preview
├─────────────────────────────────────────┤
│         Testimonials                    │ ← Customer reviews
├─────────────────────────────────────────┤
│             CTA                         │ ← Final call-to-action
├─────────────────────────────────────────┤
│            Footer                       │ ← Links & info
└─────────────────────────────────────────┘
```

### Create Page Flow (app/create/page.tsx)
```
┌─────────────────────────────────────────┐
│            Navbar                       │
├─────────────────────────────────────────┤
│         Page Header                     │
│   "Create Your Battle Card Deck"       │
├─────────────────────────────────────────┤
│         IntakeForm                      │
│                                         │
│  Section 1: Basic Information          │
│  - Job Title                           │
│  - Department                          │
│  - Experience Level                    │
│  - Location                            │
│  - Work Model                          │
│  - Salary Range                        │
│                                         │
│  Section 2: Company Context            │
│  - Company Size                        │
│  - Team Size                           │
│  - Reports To                          │
│                                         │
│  Section 3: Role Details               │
│  - Key Responsibilities                │
│  - Required Skills                     │
│  - Hiring Timeline                     │
│                                         │
│  [Generate Battle Card Deck Button]    │
└─────────────────────────────────────────┘
```

### Results Page Flow (app/results/page.tsx)
```
┌─────────────────────────────────────────┐
│            Navbar                       │
├─────────────────────────────────────────┤
│      Results Header                     │
│  [Download] [Share] buttons            │
├─────────────────────────────────────────┤
│      Battle Cards Grid                  │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ Role   │ │Compens-│ │ Market │     │
│  │Definition│ation  │ │ Data   │     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │Require-│ │Response│ │Culture │     │
│  │ments   │ │bilities│ │  Fit   │     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
│  ┌────────┐ ┌────────┐                │
│  │Message-│ │Interview│                │
│  │  ing   │ │ Guide  │                │
│  └────────┘ └────────┘                │
├─────────────────────────────────────────┤
│         Upgrade CTA                     │
└─────────────────────────────────────────┘
```

## 🎨 Styling Architecture

### Global Styles (app/globals.css)
- Tailwind base, components, utilities
- Custom component classes:
  - `.btn-primary` - Primary button style
  - `.btn-secondary` - Secondary button style
  - `.card` - Card container style
  - `.gradient-text` - Gradient text effect
  - `.section-container` - Max-width container
- Custom scrollbar styling
- Animation utilities

### Tailwind Configuration (tailwind.config.ts)
- **Extended Colors**:
  - Primary: Blue palette (50-900)
  - Secondary: Purple palette (50-900)
- **Custom Animations**:
  - `fade-in` - Fade in effect
  - `slide-up` - Slide up from bottom
  - `float` - Floating animation
- **Font Family**: Inter (system fallback)

## 🔌 API Architecture

### POST /api/generate-cards
**Location**: `app/api/generate-cards/route.ts`

**Request Flow**:
```
Client Form Submission
        ↓
    API Route Handler
        ↓
generateBattleCards() function
        ↓
    Card Data Processing
        ↓
    JSON Response
        ↓
Client receives cards → sessionStorage → Results page
```

**Generated Card Types**:
1. Role Definition (Briefcase icon, Blue gradient)
2. Compensation (Dollar icon, Green gradient)
3. Market Intelligence (Trending icon, Purple gradient)
4. Requirements (Check icon, Pink gradient)
5. Responsibilities (List icon, Indigo gradient)
6. Culture Fit (Users icon, Orange gradient)
7. Messaging (Message icon, Teal gradient)
8. Interview Guide (Clipboard icon, Yellow gradient)

## 🎭 Component Props & Types

### BattleCard Component
```typescript
interface BattleCardProps {
  card: {
    id: number;
    type: string;      // Card category
    title: string;     // Card title
    icon: string;      // Icon identifier
    content: any;      // Card-specific content
  };
  index: number;       // For stagger animation
}
```

### IntakeForm State
```typescript
interface FormData {
  jobTitle: string;
  department: string;
  experienceLevel: string;
  location: string;
  workModel: string;
  salaryRange: string;
  companySize: string;
  keyResponsibilities: string;
  requiredSkills: string;
  hiringTimeline: string;
  teamSize: string;
  reportingTo: string;
}
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0284c7` to `#0369a1`
- **Secondary Purple**: `#9333ea` to `#7e22ce`
- **Card Gradients**: 8 unique gradient combinations
- **Neutrals**: Gray scale (50-900)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes (4xl-7xl)
- **Body**: Regular, comfortable line-height
- **Labels**: Semibold, uppercase tracking

### Spacing
- **Section Padding**: py-20 to py-32
- **Container**: max-w-7xl with responsive padding
- **Card Gaps**: gap-6 to gap-8
- **Element Spacing**: space-y-4 to space-y-8

### Shadows & Effects
- **Cards**: shadow-md, hover:shadow-xl
- **Buttons**: shadow-lg, hover:shadow-xl
- **Backdrops**: backdrop-blur-sm
- **Gradients**: Multiple gradient overlays

## 🔄 Data Flow

```
User Input (Form)
      ↓
Frontend Validation
      ↓
API Request (POST)
      ↓
Server Processing
      ↓
Card Generation
      ↓
JSON Response
      ↓
SessionStorage
      ↓
Results Display
      ↓
User Actions (Download/Share)
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
Default (< 768px)     → Single column, stacked layout
md: (≥ 768px)         → 2 columns, tablet optimization
lg: (≥ 1024px)        → 3-4 columns, desktop layout
xl: (≥ 1280px)        → Full width, enhanced spacing
```

## ⚡ Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component ready
3. **Font Loading**: Optimized with next/font
4. **CSS**: Tailwind purges unused styles
5. **Animations**: GPU-accelerated with Framer Motion
6. **Lazy Loading**: Components load on demand

## 🚀 Build Output

```
Production Build (npm run build):
├── Static Pages (pre-rendered)
│   ├── / (Homepage)
│   ├── /create
│   └── /results
├── API Routes (serverless functions)
│   └── /api/generate-cards
├── Static Assets
│   ├── CSS (optimized, minified)
│   ├── JS (split, tree-shaken)
│   └── Fonts (subset, optimized)
└── Metadata (SEO, manifests)
```

---

**Built with**: Next.js 15, React 18, TypeScript, TailwindCSS, Framer Motion
