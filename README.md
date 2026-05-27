# RecipeFlow Frontend

A modern Next.js frontend for the RecipeFlow recipe sharing application.

## Features

- 🔐 **User Authentication**: Register and login with JWT tokens
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🍳 **Recipe Management**: Browse, create, update, and delete recipes
- 👍 **Social Features**: Like and dislike recipes
- 🏷️ **Categorization**: Organize recipes by category and tags
- 📋 **Rich Recipe Details**: Ingredients, instructions, equipment, cooking time

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Authentication**: JWT (stored in localStorage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:2727/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar
│   ├── RecipeCard.tsx  # Recipe card component
│   ├── FormFields.tsx  # Form input components
│   └── ProtectedRoute.tsx
├── lib/
│   ├── api.ts          # API client and endpoints
│   └── auth-store.ts   # Zustand auth store
├── login/              # Login page
├── register/           # Register page
├── recipes/
│   ├── page.tsx        # Recipe list page
│   ├── [id]/page.tsx   # Recipe detail page
│   └── new/page.tsx    # Create recipe page
├── page.tsx            # Home page
├── layout.tsx          # Root layout
└── globals.css         # Global styles
```

## API Integration

The frontend communicates with the Spring Boot backend at `http://localhost:2727/api`.

### Authentication Endpoints
- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login

### Recipe Endpoints
- `GET /recipes` - Get all recipes
- `GET /recipes/{id}` - Get recipe by ID
- `POST /recipes` - Create recipe
- `PUT /recipes/{id}` - Update recipe
- `DELETE /recipes/{id}` - Delete recipe
- `POST /recipes/{id}/like` - Like recipe
- `POST /recipes/{id}/dislike` - Dislike recipe

## Authentication Flow

1. Users register or login
2. JWT token is received and stored in localStorage
3. Token is automatically included in all API requests
4. Protected routes redirect unauthenticated users to login

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Set `NEXT_PUBLIC_API_URL` to your backend URL when deploying.

## Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## License

MIT
