# BAOTH-MIX (Mobile-First Vanilla JS)

Starter project for a mobile-first web app using Vanilla JavaScript, Vite, and Socket.IO client.

## Tech Stack

- Vanilla JavaScript (ES modules)
- Vite
- Socket.IO client
- Yarn as the primary package manager

## Quick Start (Yarn)

```bash
yarn install
yarn dev
```

Build and preview:

```bash
yarn build
yarn preview
```

## Project Structure

```text
.
|-- index.html
|-- package.json
|-- vite.config.js
`-- src
    |-- app
    |   `-- app.js
    |-- components
    |-- core
    |-- features
    |   `-- home
    |       `-- homeView.js
    |-- services
    |   `-- socket
    |       `-- socketClient.js
    |-- styles
    |   |-- mobile.css
    |   `-- reset.css
    |-- utils
    |   `-- dom.js
    `-- main.js
```

## Mobile UI Guidelines

- Design first for narrow screens (320px and up), then scale to tablet/desktop.
- Keep touch targets at least 44px high.
- Use vertical layout by default (stacked cards, clear spacing, short text lines).
- Avoid heavy layout shifts; reserve space and keep interactions predictable.

## Required UI Direction (Project Rule)

- All new UI should be built in vertical flow first (top-to-bottom layout).
- For mobile small screens, content blocks should use full available width.
- Primary and secondary action buttons should be full-width by default on mobile.
- Horizontal two-column layouts should only be added for tablet/desktop breakpoints.

## Theme Direction (Project Rule)

- The default visual theme must always use yellow, black, and white as the main color system.
- New UI components should follow this palette first, then only add extra colors when strictly needed.
- Keep contrast strong and readable on mobile screens using this yellow-black-white foundation.

## Socket.IO Configuration

Socket client reads endpoint from `VITE_SOCKET_URL`.

Create `.env` when needed:

```bash
VITE_SOCKET_URL=http://localhost:3000
```

If not set, the fallback URL is `http://localhost:3000`.

## Notes

- This repo is scaffolded and ready for the next implementation steps.
- No dev server execution is required in this setup step.
