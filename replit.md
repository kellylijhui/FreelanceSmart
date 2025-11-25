# FreelanceSmart Quote Generator

## Overview
A professional quote generator web application designed for freelance creatives who need to price their work consistently. The tool allows users to input project parameters and automatically generates a price range along with a professional email summary to send to clients. Now includes AI-powered rate suggestions based on portfolio work samples.

## Current State
The application is fully functional with all requested features:
- Real-time price calculation
- Friends & Family discount option (15% off)
- AI Rate Advisor - upload work samples for AI-suggested pricing
- Professional client email proposal generation
- Copy to clipboard functionality
- Responsive design for mobile and desktop

## Tech Stack
- **Language**: JavaScript
- **Framework**: React 18 (Vite) + Express.js backend
- **Styling**: Tailwind CSS
- **Build Tool**: Vite 5
- **AI**: OpenAI GPT-5 for image analysis

## Project Structure
```
├── src/
│   ├── App.jsx          # Main React component with all functionality
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports and base styles
├── server.js            # Express backend for AI image analysis
├── start.sh             # Script to run both frontend and backend
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration with API proxy
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Features
1. **Input Section (Left Side)**:
   - Hourly Rate input field
   - Project Type dropdown (Logo Design, Copywriting, Web Dev, Consultation)
   - Estimated Hours slider (1-200 hours)
   - Add-ons & Discounts:
     - Rush Delivery (+25%)
     - 3 Revisions (+$150 fixed)
     - Source Files (+10%)
     - Friends & Family Discount (-15%)

2. **AI Rate Advisor**:
   - Upload past work samples (images up to 10MB)
   - AI analyzes work quality and complexity
   - Suggests appropriate hourly rate with range
   - Shows skill level assessment and reasoning
   - One-click apply suggested rate

3. **Output Section (Right Side)**:
   - Dynamic Total Estimated Quote display
   - Price breakdown showing all components including discounts
   - Auto-generated professional email proposal
   - Copy to Clipboard button

## Environment Variables
- `OPENAI_API_KEY`: Required for AI Rate Advisor feature

## Running the Application
```bash
npm run dev
```
The app runs on port 5000, with API server on port 3001.

## Recent Changes
- **2025-11-25**: Added AI Rate Advisor and Friends & Family discount
  - Image upload for work samples
  - OpenAI GPT-5 integration for rate analysis
  - Friends & Family 15% discount option
  - Express backend for secure API calls
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
- Separate backend server for secure AI API calls
