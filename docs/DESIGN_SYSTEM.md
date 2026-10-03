# Design System

## Colors

- **Primary Farm Green**: `#2F6B3B` (primary actions, agriculture, healthy states)
- **Dark Forest Green**: `#1F4D2B` (darker hover states, important headings)
- **Water Blue**: `#176B87` (water, borewell, irrigation, soil moisture)
- **Solar Amber**: `#D99A22` (solar, energy)
- **Earth Brown**: `#795548` (soil, ground, farm-related)
- **Main Background**: `#F5F7F2`
- **Surface**: `#FFFFFF`
- **Secondary Background**: `#EDF2EA`
- **Primary Text**: `#26332A`
- **Secondary Text**: `#66736A`
- **Muted Text**: `#89938C`
- **Border**: `#DCE3DC`
- **Warning / Critical**: `#C94A45`

## Typography
- **Family**: Inter (or clean professional sans-serif)
- **Weights**: Medium/semi-bold for headings, regular for body.
- Highly readable, strong numerical hierarchy.

## AquaVolt Branding
- A custom vector SVG Logo (incorporating a water drop, a leaf, and a central solar spark) is established as the primary brand mark in `src/components/ui/Logo.tsx`.
- Generic Lucide icons (like Sprout) should not be used as the primary brand logo.
- The brand identity relies on real, high-quality, professional photography of Indian agriculture (e.g. solar irrigation fields) rather than AI-generated futuristic landscapes or text placeholders.
- Keep the brand consistent across Login, Signup, Onboarding, Sidebar, Dashboard, and all future screens.

## Spacing and Layout
- Use consistent whitespace, subtle borders, restrained shadows.
- Avoid excessive floating elements, huge rounded cards, or glassmorphism.

## Strict Visual Design Rules
Maintain the established AquaVolt design system:
- professional agricultural technology
- natural green, water blue, solar amber, earth tones
- clean white surfaces, subtle borders, restrained shadows, moderate border radius, Inter-style typography

**Avoid:**
- excessive gradients, neon, glow effects
- glassmorphism
- excessive shadows, excessive rounded cards
- futuristic/overly-AI visual language

## Animation Principles
- Allowed: sidebar expansion, dropdown opening, hover/focus states, button feedback, loading states.
- Avoid: excessive animation, floating UI, flashy effects, unnecessary parallax.
