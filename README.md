# Gameboy Tracker

A web-based music tracker for creating chiptune music reminiscent of the original Nintendo Gameboy.

## ✨ Features

- Authentic Gameboy sound emulation (or inspired sound capabilities)
- Pattern-based sequencing
- Multiple channels (Pulse 1, Pulse 2, Wave, Noise)
- Control over note, volume, duty cycle, envelope, sweep, and waveform per step
- Song arrangement by chaining patterns
- Playback controls (Play, Stop, Loop)
- BPM and Master Volume adjustments

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Routing:** TanStack Router
- **State Management:** Jotai
- **Styling:** Tailwind CSS, shadcn/ui
- **Audio:** Web Audio API

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/daniel-black/gameboy-tracker
    cd gameboy-tracker
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

## 🛠️ Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally.

## 🎮 Gameboy Audio Resources

- https://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware
- https://gbdev.io/pandocs/Audio.html
- https://aselker.github.io/gameboy-sound-chip
- https://gbstudiocentral.com/tipsgb-studio-tracker-lesson-1-terminology-and-basics-of-the-game-boy-sound-chip
