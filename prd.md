# Product Requirements Document (PRD)

## Project
**Personal Portfolio Website - Fachrial Arkaan Rasendriya**

## Tech Stack
- HTML5
- CSS3 (Vanilla CSS)
- Vanilla JavaScript

## Objective
Create a premium interactive portfolio showcasing profile, certificates, projects, and contact information.

## Visual Theme: Blue Fracture
- **Background**: Dark navy background (`#071327`)
- **Visuals**: Random glowing blue cracked-glass pattern (using custom inline SVGs)
- **Accents**: Cyan glow effects
- **Particles**: Smooth animated floating particles on Canvas
- **Interface**: Modern glassmorphism UI (semi-transparent backgrounds, blur filters, elegant borders)

## Navigation & Layout
- **Structure**: Four main panels/sections:
  1. Home
  2. Certificates
  3. Projects
  4. Contact
- **Navigation Input**: Keyboard left/right arrows and mouse scroll wheel (with smooth debounce)
- **Transition**: 3D camera rotation flip-card style transition (`rotateY` + perspective) between sections rather than normal standard scrolling.

## Section Details

### 1. Home
- Large name display: **Fachrial Arkaan Rasendriya**
- Professional description
- Profile photo placeholder
- Call-to-actions: "Download CV" button, GitHub link, LinkedIn link

### 2. Certificates
- Grid gallery layout with placeholder cards (Lorem Ipsum titles/descriptions)
- Certificate upload feature: Users can upload image files which are saved in browser `localStorage` as base64 data URLs to persist upon page refresh.
- Popup / modal preview when a certificate is clicked.
- Fields: Issuer, Date, Description.

### 3. Projects
- Categories: **IoT**, **Machine Learning**, and **Networking** (Web Development is excluded)
- Project cards with placeholder images and Lorem Ipsum details.
- Modal dialog for viewing project details.

### 4. Contact
- Contact details:
  - Phone: `089680828742`
  - Email: `arkaanfachrial@gmail.com`
- Optional social links.

## Animations
- Intro opening animation
- Blue crack glow pulsing effects
- Hover lift + glow interactive effects
- 3D page rotation navigation transitions
- Smooth transitions with custom easing (0.8s - 1.2s duration)

## Folder Structure
```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── images/
    ├── certificates/
    └── projects/
```
