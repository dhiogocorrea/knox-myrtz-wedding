# 💍 Knox & Mytz Wedding Website

A beautiful, modern wedding website built with love for G & M's special day. This elegant web application features a romantic design with interactive elements, multi-language support, and a delightful user experience.

## ✨ Features

- 🎨 **Elegant Design** - Romantic color palette with gold accents and sophisticated typography
- 🌍 **Bilingual Support** - Full English and Portuguese translations (i18n)
- 🔐 **Guest Authentication** - Private access system with password-protected entry
- 📅 **Event Schedule** - Interactive timeline with location details
- 💌 **RSVP System** - Easy guest response management
- 🗺️ **Tourist Information** - Local attractions and recommendations
- 💎 **Wedding Details** - Gift registry, dress code, and important information
- ✨ **Interactive Effects** - Falling petals animation and magical cursor sparkles
- 📱 **Fully Responsive** - Perfect experience on all devices
- ⚡ **Fast & Modern** - Built with Next.js 15+ and React 19

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Config**: YAML-based content management
- **Validation**: Zod schemas
- **Fonts**: Great Vibes (script), Cormorant Garamond (serif)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd knox-wedding

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Run the development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
knox-wedding/
├── config/
│   └── site.yaml          # Main configuration (couple info, guests, content)
├── public/
│   └── images/            # Static images
├── src/
│   ├── app/
│   │   ├── [locale]/      # Internationalized routes
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── WeddingApp.tsx        # Main app component
│   │   ├── Navigation.tsx        # Top navigation bar
│   │   ├── HeroSection.tsx       # Landing page
│   │   ├── LoginGate.tsx         # Authentication wrapper
│   │   ├── LoginScreen.tsx       # Login interface
│   │   ├── ScheduleSection.tsx   # Event timeline
│   │   ├── RsvpSection.tsx       # RSVP form
│   │   ├── TouristicSection.tsx  # Tourist info
│   │   ├── WeddingInfoSection.tsx # Wedding details
│   │   ├── Footer.tsx            # Footer component
│   │   ├── PetalOverlay.tsx      # Falling petals animation
│   │   └── CursorEffect.tsx      # Magical cursor sparkles
│   └── lib/
│       ├── config.ts       # Config loader
│       ├── i18n.ts         # Internationalization
│       ├── schema.ts       # Zod schemas
│       └── utils.ts        # Utility functions
└── package.json
```

## ⚙️ Configuration

All website content is managed through `config/site.yaml`:

- **Couple Information**: Names, photos, social media
- **Wedding Details**: Date, venue, schedule
- **Guest List**: Access passwords and RSVP tracking
- **Translations**: English and Portuguese content
- **Registry & Info**: Gift lists, dress code, FAQ

## 🎨 Customization

### Colors

Edit the color palette in `src/app/globals.css`:

```css
--color-charcoal: ...
--color-warm-gray: ...
--color-gold: ...
--color-rose: ...
```

### Fonts

Fonts are loaded in `src/app/layout.tsx` using `next/font/google`.

### Content

Update all text, dates, and information in `config/site.yaml`.

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

This Next.js app can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

## 📝 License

Private project - All rights reserved.

## 💝 Credits

**Made with love by [Orimaz](https://github.com/orimaz)**

---

### 💌 A Special Message for G & M

*Dear G & M,*

*May this website be just the beginning of your beautiful journey together. Like the code that powers these pages, may your love be strong, elegant, and built to last. Every line written here carries wishes for your happiness, every animation symbolizes the joy you bring to each other.*

*Your love story inspired every detail—from the falling petals to the golden accents. May your marriage be as seamless as this site's design, as responsive as its features, and as timeless as true love itself.*

*Here's to a lifetime of commits to each other, zero bugs in your relationship, and infinite loops of laughter and love. May your union compile perfectly and run smoothly for all eternity.*

*With all my heart, congratulations on your special day!*

*— Orimaz 💜*

---

✨ *Built with Next.js, TypeScript, Tailwind CSS, and lots of ❤️*
