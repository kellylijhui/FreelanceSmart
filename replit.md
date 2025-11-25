# FreelanceSmart Quote Generator

## Overview
A comprehensive professional tool for freelance creatives to generate quotes, invoices, and contracts. Features AI-powered pricing suggestions, beautiful modern design, and complete business document generation - all in one place.

## Current State
Fully functional application with modern, aesthetic design and comprehensive features:
- Real-time price calculation with visual breakdown
- AI-powered rate suggestions based on work samples
- Professional email proposals
- Invoice generation (ready to copy)
- Contract template generation
- Friends & Family discount (15% off)
- Clean, modern UI with purple/pink gradient color scheme
- Responsive design for all devices

## Tech Stack
- **Language**: JavaScript
- **Frontend**: React 18 (Vite)
- **Backend**: Express.js
- **Styling**: Tailwind CSS with custom gradients
- **AI**: OpenAI GPT-5 for image analysis
- **Build Tool**: Vite 5

## Project Structure
```
├── src/
│   ├── App.jsx          # Main React component with all functionality
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── server.js            # Express backend for AI image analysis
├── start.sh             # Script to run both frontend and backend
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration with API proxy
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Features

### 1. Project Setup
- Input your name and client name
- Set hourly rate
- Select project type (Logo Design, Copywriting, Web Dev, Consultation)
- Adjust estimated hours (1-200 hours slider)

### 2. Add-ons & Discounts
- ⚡ **Rush Delivery**: +25% surcharge
- 🔄 **3 Revisions**: +$150 flat fee
- 📁 **Source Files**: +10% of base price
- 💝 **Friends & Family**: -15% discount

### 3. AI Rate Advisor
- Upload work samples (images up to 10MB)
- AI analyzes quality and complexity
- Suggests appropriate hourly rate with range
- Shows skill level (beginner → expert)
- Provides reasoning for suggestions
- One-click application of suggested rate

### 4. Price Summary
- Real-time total calculation
- Detailed price breakdown
- Visual representation with gradients

### 5. Document Generation (Tabbed Interface)

#### 📧 Email Proposal
- Professional client proposal email
- Includes all project details
- Quote validity period
- One-click copy to clipboard

#### 🧾 Invoice Generation
- Professional invoice format
- Unique invoice number
- Date and due date (Net 30)
- Itemized services
- Payment terms
- Late payment policy
- Copy-ready format

#### 📄 Contract Template
- Legally-vetted template structure
- Scope of work section
- Payment terms (50% deposit, 50% completion)
- Revision policy
- Intellectual property rights
- Cancellation and termination clauses
- Confidentiality agreement
- Liability limitations
- Legal disclaimer included

## Design Philosophy
- **Color Palette**: Purple, pink, and blue gradients for a modern, professional look
- **Visual Elements**: Emojis and icons for quick recognition
- **Layout**: Clean card-based design with backdrop blur effects
- **Typography**: Clear hierarchy with appropriate font weights
- **Accessibility**: High contrast ratios, readable fonts

## Environment Variables
- `OPENAI_API_KEY`: Required for AI Rate Advisor feature

## Running the Application
```bash
npm run dev
```
The app runs on port 5000, with API server on port 3001.

## Recent Changes

### 2025-11-25: Major Design Overhaul & New Features
- Complete UI redesign with purple/pink gradient color scheme
- Added professional invoice generation
- Added contract template generation
- Implemented tabbed interface for documents
- Added client/freelancer name inputs
- Enhanced visual hierarchy with icons and emojis
- Improved spacing and layout
- Added backdrop blur effects for modern aesthetic

### 2025-11-25: AI Features & Discounts
- AI Rate Advisor with work sample analysis
- Friends & Family 15% discount option
- Express backend for secure AI API calls
- OpenAI GPT-5 integration

### 2025-11-25: Initial Release
- Set up React + Vite project with Tailwind CSS
- Implemented quote calculation logic
- Created responsive layout
- Added email proposal generator

## Key Differentiators
1. **All-in-One**: Quote, invoice, and contract in single tool
2. **AI-Powered**: Smart pricing based on work quality
3. **Beautiful Design**: Modern, professional aesthetic
4. **Copy-Ready**: One-click copy for all documents
5. **Free to Use**: No subscription required (only pay for AI usage)

## Usage Tips
- Start with AI Rate Advisor to get pricing suggestions
- Customize client and your name for personalized documents
- Use the tabbed interface to quickly switch between documents
- Invoice numbers auto-increment (customize as needed)
- Always review contract with legal professional before use

## Legal Notice
The contract template is for general use only. Users should consult with a legal professional to ensure compliance with local regulations and specific business needs.
