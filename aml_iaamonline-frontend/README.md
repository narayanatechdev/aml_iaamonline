# AML IAA Online - Frontend

Next.js frontend application with shadcn/ui components using Indigo (theme), Taupe (base color), and Luma (light) preset.

## Setup

### Installation

```bash
cd aml_iaamonline-frontend
npm install
```

### Environment Variables

Create a `.env.local` file or use the provided defaults:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=AML IAA Online
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## Project Structure

```
aml_iaamonline-frontend/
├── app/
│   ├── globals.css           # Global styles with Tailwind and theme variables
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page
├── components/
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── api-client.ts         # API client utilities
│   └── cn.ts                 # Class name utility
├── public/                   # Static assets
├── .env.local                # Environment variables
└── package.json
```

## Styling

The theme uses CSS variables from the preset:
- **Style**: Luma (Light mode)
- **Theme Color**: Indigo (Primary)
- **Base Color**: Taupe (Secondary)

All colors are defined in `app/globals.css` and can be customized there.

## API Integration

The frontend communicates with the Laravel backend via the `apiClient` utility:

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const data = await apiClient.get('/endpoint');

// POST request
const response = await apiClient.post('/endpoint', { data });

// PUT request
const updated = await apiClient.put('/endpoint/123', { data });

// DELETE request
await apiClient.delete('/endpoint/123');
```

## Components

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="md">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Input
```tsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Enter text" />
```
