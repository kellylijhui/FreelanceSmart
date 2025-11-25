# FreelanceSmart Quote Generator

## Overview
A professional quote generator web application designed for freelance creatives who need to price their work consistently. The tool allows users to input project parameters and automatically generates a price range along with a professional email summary to send to clients.

## Current State
The application is fully functional with all requested features:
- Real-time price calculation
- Professional client email proposal generation
- Copy to clipboard functionality
- Responsive design for mobile and desktop

## Tech Stack
- **Language**: JavaScript
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite 5

## Project Structure
```
├── src/
│   ├── App.jsx          # Main application component with all functionality
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports and base styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Features
1. **Input Section (Left Side)**:
   - Hourly Rate input field
   - Project Type dropdown (Logo Design, Copywriting, Web Dev, Consultation)
   - Estimated Hours slider (1-200 hours)
   - Add-ons checkboxes:
     - Rush Delivery (+25%)
     - 3 Revisions (+$150 fixed)
     - Source Files (+10%)

2. **Output Section (Right Side)**:
   - Dynamic Total Estimated Quote display
   - Price breakdown showing all components
   - Auto-generated professional email proposal
   - Copy to Clipboard button

## Running the Application
```bash
npm run dev
```
The app runs on port 5000.

## Recent Changes
- **2025-11-25**: Initial creation of FreelanceSmart Quote Generator
  - Set up React + Vite project with Tailwind CSS
  - Implemented full quote calculation logic
  - Created responsive two-column layout
  - Added email proposal generator with copy functionality

## Design Decisions
- Used slate color palette for professional, clean appearance
- Card-based layout with soft shadows for modern look
- Responsive grid layout adapts between mobile (stacked) and desktop (side-by-side)
- Real-time calculations using React useMemo for performance
