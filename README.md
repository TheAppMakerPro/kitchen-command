# Kitchen Command

Your personal recipe hub - search, save, and plan delicious meals.

![Kitchen Command](public/icon.png)

## Features

- **Recipe Search** - Search thousands of recipes by name, ingredient, category, or cuisine
- **Smart Filtering** - Filter by dietary preferences, allergens, and cooking time
- **Favorites** - Save your favorite recipes for quick access
- **Meal Planner** - Plan your weekly meals with a drag-and-drop calendar
- **Shopping List** - Auto-generate shopping lists from your meal plan
- **My Fridge** - Track ingredients you have and find recipes to make
- **Collections** - Browse curated recipe collections
- **Offline Support** - Works offline with cached recipes and images
- **PWA Ready** - Install as an app on mobile and desktop

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **TheMealDB API** - Recipe data
- **Service Worker** - Offline support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TheAppMakerPro/kitchen-command.git

# Navigate to the project
cd kitchen-command

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### cPanel / Apache Server

1. Run `npm run build`
2. Upload the contents of the `dist/` folder to your server's `public_html` directory
3. The included `.htaccess` file handles client-side routing

### Vercel / Netlify

Simply connect your GitHub repository - these platforms auto-detect Vite projects.

## Project Structure

```
kitchen-command/
├── public/
│   ├── icon.png          # App icon (512x512)
│   ├── favicon.png       # Favicon (32x32)
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
├── src/
│   ├── api/             # API client
│   ├── components/      # React components
│   │   ├── Layout/      # Header, Sidebar, Navigation
│   │   ├── Recipe/      # Recipe cards, details, grid
│   │   ├── MealPlanner/ # Meal planning components
│   │   ├── Search/      # Search bar, filters
│   │   ├── ShoppingList/# Shopping list components
│   │   └── ui/          # Reusable UI components
│   ├── context/         # React context providers
│   ├── data/            # Static data (dietary, nutrition)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## Features in Detail

### Offline Support
Kitchen Command works offline! Recipes you've viewed are cached automatically, along with their images. You can browse your favorites and cached recipes without an internet connection.

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- Color blind mode options
- Adjustable text sizes
- High contrast mode

### Dietary Preferences
Set your dietary preferences once and get personalized recipe recommendations:
- Vegetarian, Vegan, Gluten-Free, Dairy-Free
- Allergen warnings (nuts, shellfish, eggs, etc.)
- Health-focused options (low-carb, high-protein)

## API

This app uses [TheMealDB](https://www.themealdb.com/) free API for recipe data.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
