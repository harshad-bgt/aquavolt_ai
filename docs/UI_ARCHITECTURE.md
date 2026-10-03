# UI Architecture

## Application Shell
- Top navigation
- Sidebar
- Page content area
- User menu
- Language selector
- Notification area

## Navigation & Sidebar Requirements
- **Sidebar**:
  - Collapsed icon-only sidebar state.
  - Expanded icon + label sidebar state.
  - Smooth expand/collapse interaction and hover states.
  - Lucide-style line icons (do not use emojis).
  - Include Profile section, Search, Bottom navigation/actions.
  - Appropriate active navigation state and consistent spacing/hierarchy.
- **Mobile Navigation**: Responsive mobile drawer.

## Language Selector Requirements
- English is the default language.
- Clean dropdown interaction with chevron indicator/rotation.
- Selected-language indicator, hover states, click-outside closing.
- Keyboard accessible.
- Future language options: English, Marathi, Hindi, Tamil, Telugu, Kannada, Bengali, Gujarati.
- *Note: Keep architecture and visual requirements preserved even when localization is not yet functional.*

## Page Layouts
- **Login/Signup**: Two-panel on desktop, single column on mobile.
- **Dashboard**: Multi-column responsive grid with cards for Status, Advice, etc.

## Reusable UI Patterns
- Status Cards
- Metric Cards
- Forms and Inputs
- Modals and Toasts
- Progress Indicators
