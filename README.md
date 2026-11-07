# 📋 Request Types Portal

A modern, responsive, enterprise-grade web application for configuring and managing organizational request types, workflows, escalation rules, and dynamic custom form attributes.

Built with **Angular (v19+)** utilizing modern **Angular Signals**, standalone architecture, and **DevExtreme Angular** enterprise UI components.

---

## 🌟 Key Features

### 1. Request Types Management & Grid
- **Responsive Data Grid**: Powered by DevExtreme `dx-data-grid` with multi-column sorting, client-side pagination, search highlighting, and adaptive column hiding (`hidingPriority`).
- **Interactive Quick Filters**: Filter requests by category pills (*Employee*, *Supervisor*, *General*, *Document*) and toggle visibility of inactive request types.
- **State Toggle & Actions**: Contextual 3-dot dropdown menu (`dx-drop-down-button`) for viewing, editing, activating/deactivating, and safely deleting request types.

### 2. Request Details & Dynamic Form Builder
- **Static Configuration**: Configure request names, localized alternate names, categories, posting roles, default reports, and backdated request day limits.
- **Dynamic Custom Sections**: Organize form fields into customizable, ordered sections with real-time tab switching.
- **Dynamic Custom Attributes Builder**:
  - Supports multiple input types: `Text`, `Drop down`, `Check box`, and `Date`.
  - Configurable validation rules (`Required`, `Maximum characters`).
  - Interactive modal dialog (`dx-popup`) with inline option addition, editing, and deletion for dropdown items.
  - State isolation via `linkedSignal` to prevent draft data mutations on cancellation.

### 3. Escalation & Reminder Rules
- **Escalation Settings**: Set signature timeout thresholds before escalating to roles (e.g. *Department Head*, *HR*), and request timeouts before triggering administrative signaling.
- **Reminders**: Configurable automated intervals for signature reminders and pending request reminders.

### 4. Architecture & Clean Code Highlights
- **Angular 19+ Modern Signals**: Reactive UI state management using `signal`, `computed`, `model`, and `linkedSignal` for predictable unidirectional data flow.
- **High Performance (`OnPush`)**: Strict `ChangeDetectionStrategy.OnPush` across all components with zero unnecessary change detection cycles.
- **Memory-Safe Subscriptions**: Automatic observable lifecycle cleanup using `takeUntilDestroyed(destroyRef)`.
- **Single Source of Truth**: Centralized configuration and labels in `request-types.constants.ts` shared across pipes, filters, and form dialogs.
- **Immutable State Updates**: Clean immutable patterns using spread operators (`...`) ensuring zero unwanted side-effects.

---

## 🛠️ Tech Stack & Libraries

| Technology | Purpose |
| :--- | :--- |
| **Angular 19+** | Frontend framework (Standalone Components, Signals, New Control Flow `@if` / `@for`) |
| **DevExtreme Angular** | Enterprise UI components (`dx-data-grid`, `dx-popup`, `dx-form`, `dx-select-box`, `validationEngine`, etc.) |
| **RxJS** | Reactive streams for HTTP and API service interactions |
| **Bootstrap 5.3+ & Icons** | Responsive layout grid, utility classes, and iconography |
| **JSON Server** | Lightweight local REST API for mock backend persistence (`db.json`) |
| **TypeScript** | Strict typing, enums, interfaces, and DTO contracts |

---

## 📁 Project Structure

```text
src/app/
├── api/
│   └── request-types/
│       ├── request-types-dto.ts          # Interfaces and Data Transfer Objects
│       ├── request-types-enums.ts        # Enums (RequestCategory, RequestState, etc.)
│       ├── request-types.constants.ts    # Single source of truth for options & labels
│       └── request-types.service.ts      # REST API client service
├── pages/
│   ├── request-types/                    # Main listing & overview page
│   │   ├── components/
│   │   │   ├── request-types-filters/    # Category filter pills & active toggles
│   │   │   └── request-types-grid/       # Standalone DevExtreme grid component
│   │   ├── request-types.component.ts
│   │   └── request-types.routes.ts
│   └── request-type-details/             # Add / Edit / View details page
│       ├── components/
│       │   ├── attribute-details-dialog/ # Modal dialog for creating custom attributes
│       │   ├── attribute-item/           # Individual attribute preview chip
│       │   ├── custom-sections/          # Dynamic section orchestrator component
│       │   ├── details-static-form/      # Core details (name, category, role)
│       │   ├── escalation-form/          # Escalation settings form
│       │   ├── reminders-form/           # Reminder settings form
│       │   └── section-card/             # Card container for section attributes
│       └── request-type-details.component.ts
└── shared/                               # Reusable standalone components & pipes
    ├── components/
    │   ├── checkbox/                     # Reusable styled checkbox
    │   ├── days-input/                   # Days number-box input wrapper
    │   ├── dropdown/                     # Reusable select-box with validator
    │   ├── footer/                       # Dialog action footer component
    │   ├── page-header/                  # Standardized toolbar page header
    │   ├── search-box/                   # Search input box
    │   └── section-divider/              # Divider with section header tag
    └── pipes/
        ├── attribute-type-label.pipe.ts  # Pipe translating attribute type enums
        └── category-label.pipe.ts        # Pipe translating category enums
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or v20.x or higher
- **npm**: v9.x or higher

### 1. Clone the Repository

```bash
git clone https://github.com/Hamza7assan/Request-Types-Portal.git
cd Request-Types-Portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Mock API Server

Open a terminal and start `json-server` (runs on `http://localhost:3000`):

```bash
npx json-server --watch db.json --port 3000
```

### 4. Start the Angular Application

Open a second terminal and start the Angular development server:

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload on code changes.

---

## 🧪 Production Build

To build the application bundle for production:

```bash
npm run build
```

The output artifacts will be placed in the `dist/request-types-portal` directory.

---

## 👤 Author

Developed by **[Hamza Hassan](https://github.com/Hamza7assan)**
