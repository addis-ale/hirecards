# HireCards - Quick Start Guide

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 15
- React 18
- TailwindCSS
- Framer Motion
- Lucide React Icons
- TypeScript

### 2. Run Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 3. Build for Production
```bash
npm run build
npm start
```

## 📋 Application Flow

### Homepage (/)
- Hero section with animated cards preview
- Features showcase (8+ card types)
- How it works (3-step process)
- Interactive battle card preview
- Customer testimonials
- Call-to-action section

### Create Page (/create)
- **3-Section Intake Form**:
  1. Basic Information (Job Title, Department, Experience Level, Location, Work Model, Salary)
  2. Company Context (Company Size, Team Size, Reporting Structure)
  3. Role Details (Key Responsibilities, Required Skills, Hiring Timeline)
- Form validation
- Loading state during card generation

### Results Page (/results)
- Display 8 generated battle cards
- Interactive expandable cards
- Download functionality (JSON export)
- Share functionality (native share API)
- Option to create another deck

## 🎨 Design Features

### Colors
- **Primary**: Blue gradient (from-primary-600 to-primary-700)
- **Secondary**: Purple gradient (from-secondary-600 to-secondary-700)
- **Accents**: Multi-color gradients for each card type

### Animations
- Smooth fade-in and slide-up animations
- Card hover effects with scale transformations
- Expandable card transitions
- Floating elements in hero section

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Customization

### Add New Card Type
Edit `app/api/generate-cards/route.ts`:

```typescript
{
  id: 9,
  type: 'Your Card Type',
  title: 'Card Title',
  icon: 'icon-name',
  content: {
    // Your content fields
  }
}
```

### Modify Color Scheme
Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Update Card Icons
Add new icon mapping in `components/BattleCard.tsx`:

```typescript
const iconMap = {
  'your-icon': YourIconComponent,
}
```

## 🎯 Key Components

- **Navbar**: Fixed navigation with scroll detection
- **Hero**: Animated hero with sample cards
- **Features**: 8 feature cards in responsive grid
- **HowItWorks**: 3-step process visualization
- **BattleCardPreview**: Interactive card selector
- **IntakeForm**: Multi-section form with validation
- **BattleCard**: Expandable card component with animations
- **Footer**: Full footer with links and social media

## 📱 Mobile Optimization

- Hamburger menu on mobile
- Touch-friendly card interactions
- Optimized font sizes for readability
- Stacked layouts on smaller screens

## 🌟 Features Highlights

1. **2-Minute Setup**: Quick form completion
2. **8+ Card Types**: Comprehensive hiring intelligence
3. **AI-Powered**: Smart content generation
4. **Export & Share**: Multiple sharing options
5. **Premium UI**: Clean, modern, and professional
6. **Fast Performance**: Optimized loading and rendering
7. **Fully Responsive**: Works on all devices
8. **Smooth Animations**: Delightful user experience

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📦 Deployment Options

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
npm run build
# Deploy /out directory
```

### Docker
```bash
docker build -t hirecards .
docker run -p 3000:3000 hirecards
```

## 🎓 Learning Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## 💡 Tips

1. Use the browser's DevTools to inspect animations
2. Test responsiveness with different viewport sizes
3. Customize card colors to match your brand
4. Add more card types based on your needs
5. Integrate with real APIs for actual data

---

**Need Help?** Open an issue or check the README.md for more details.
