# Bingo Caller PWA

A professional, mobile-friendly Bingo Caller Progressive Web App built with React and Material UI.

**[Live Demo](https://svinkle.github.io/bingo-caller/)**

## Features

- **75-Number Support:** Standard Bingo number range (1-75) organized into B-I-N-G-O columns.
- **Randomized Calling:** Effortlessly call the next number with a single click.
- **Persistent State:** Your game progress is saved locally. Accidental refreshes won't lose your called numbers!
- **Dark Mode:** A sleek, default dark theme designed for better visibility.
- **PWA Ready:** Install the app on your home screen for an app-like experience and offline access.
- **Responsive Design:** Optimized for both mobile and desktop screens.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/svinkle/bingo-caller.git
   cd bingo-caller
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment

The project is configured for automated deployment to GitHub Pages via GitHub Actions. Any push to the `main` branch will trigger a new build and deployment.

## Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material UI (MUI)](https://mui.com/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## License

MIT
