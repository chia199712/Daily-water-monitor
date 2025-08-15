# Daily Water Monitor

A TypeScript PWA application for tracking daily water intake with offline support and smart reminders.

## Features

- 🚀 **Progressive Web App**: Install on mobile home screen, works offline
- 💧 **Smart Reminders**: Customizable water intake reminders
- 📊 **Statistics & Analytics**: Track your hydration trends and progress
- 🔒 **Privacy First**: All data stored locally on your device
- 📱 **Responsive Design**: Optimized for mobile and desktop
- ⚡ **Fast Loading**: Optimized performance with caching strategies

## Tech Stack

- **Frontend**: TypeScript, Vanilla JavaScript
- **Build Tool**: Vite
- **PWA**: Service Worker, Workbox
- **Storage**: LocalStorage, IndexedDB
- **Styling**: CSS3 with CSS Variables
- **Linting**: ESLint with TypeScript

## Getting Started

### Install dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
The app will start at `http://localhost:3000`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Code Quality

### Linting
```bash
npm run lint
```

### Type checking
```bash
npm run type-check
```

### Pre-commit checklist
- No TypeScript errors
- No ESLint warnings
- Code has been refactored

## PWA Features

### Offline Support
- Core functionality works without internet
- Intelligent caching strategy
- Background sync support

### Installation
1. Open the app in a supported browser
2. Click the "Install" prompt
3. Or manually install from browser settings

### Notifications
Requests notification permission for:
- Water intake reminders
- Goal achievement notifications
- App updates

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Deployment

The built `dist` folder can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

PWA features require HTTPS. Local development with `localhost` automatically qualifies.

## Project Structure

```
├── src/
│   ├── components/          # UI components
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── main.ts             # Application entry point
│   ├── sw.ts              # Service Worker
│   └── styles.css         # Global styles
├── public/                 # Static assets
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md             # Project documentation
```

## Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m "feat: add awesome feature"`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

## License

MIT License

## Changelog

### v1.0.0 (In Development)

- Initial project setup
- PWA infrastructure
- Core type definitions
- Basic water tracking functionality

---

**Development Guidelines**:
- Keep code simple and testable
- Follow TypeScript best practices
- Maintain clean code standards