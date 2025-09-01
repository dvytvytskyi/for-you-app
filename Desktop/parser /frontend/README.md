# 🏗️ Real Estate Analytics Frontend

A modern React-based frontend for displaying real estate project analytics and AI-enhanced data.

## 🚀 Features

### 📊 Project Analytics
- **Comprehensive Dashboard** - Overview of all projects
- **Search & Filter** - Find projects by name or location
- **Statistics Cards** - Key metrics and insights
- **Responsive Design** - Works on all devices

### 🤖 AI-Enhanced Project: Imagine by Marein
- **83 AI-Analyzed Images** - All project images processed with Google AI Studio
- **Interactive Gallery** - Browse renders, plans, quality specs, and price documents
- **AI Analysis Display** - View detailed AI insights for each image
- **Modal View** - Full-size image viewing with AI analysis
- **Tabbed Navigation** - Organized by content type

## 🎯 AI Analysis Includes

### 🎨 Renders (34 images)
- Image type classification
- Room/area identification
- Key features detection
- Style and design analysis
- Quality assessment
- Overall impression

### 📐 Plans (30 images)
- Floor plan analysis
- Room layout identification
- Villa type classification
- Design features extraction
- Measurements and dimensions

### 📋 Quality Specifications (13 images)
- Document type classification
- Content analysis
- Quality standards identification
- Material specifications
- Technical details

### 💰 Price Documents (6 images)
- Document type classification
- Price information extraction
- Villa type identification
- Payment terms analysis
- Sales conditions

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Access the Application
- **Main Dashboard**: http://localhost:5173
- **AI-Enhanced Project**: http://localhost:5173/imagine-by-marein

## 📁 Project Structure

```
frontend/
├── public/
│   ├── imagine-by-marein.json     # AI-enhanced project data
│   └── downloaded_files/          # All project images
│       ├── render/               # 34 render images
│       ├── plan/                 # 30 plan images
│       ├── quality/              # 13 quality spec images
│       └── price/                # 6 price document images
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Main dashboard
│   │   ├── ProjectPage.jsx       # Generic project page
│   │   └── ImagineByMarein.jsx   # AI-enhanced project page
│   ├── components/
│   │   ├── Layout.jsx            # Main layout component
│   │   └── StatsCard.jsx         # Statistics card component
│   └── utils/
│       └── dataLoader.js          # Data loading utilities
```

## 🎨 Key Features

### AI-Enhanced Image Cards
- **Hover Effects** - Smooth animations on hover
- **AI Badge** - Visual indicator for AI-analyzed content
- **Feature Tags** - Key features extracted by AI
- **Room Type** - AI-identified room/area types
- **Overall Impression** - AI-generated descriptions

### Interactive Gallery
- **Grid Layout** - Responsive image grid
- **Modal View** - Full-size image viewing
- **AI Analysis Panel** - Detailed AI insights
- **Tabbed Navigation** - Easy content browsing

### Statistics Dashboard
- **Real-time Stats** - Live project statistics
- **Visual Cards** - Beautiful metric displays
- **Color-coded** - Different colors for different metrics

## 🔧 Development

### Adding New Projects
1. Add project data to `public/` directory
2. Create new page component in `src/pages/`
3. Add route in `src/App.jsx`
4. Update navigation as needed

### Styling
- Uses Tailwind CSS for styling
- Custom components in `src/components/`
- Responsive design with mobile-first approach

### Data Format
Projects should follow this structure:
```json
{
  "project_info": {
    "name": "Project Name",
    "location": "Location",
    "price_range": "Price Range",
    "units": 15,
    "type": "Project Type"
  },
  "renders": {
    "summary": { "total_count": 34 },
    "documents": [...]
  },
  "plans": { ... },
  "qualities": { ... },
  "prices": { ... }
}
```

## 📊 Performance

- **Lazy Loading** - Images load on demand
- **Optimized Images** - Compressed for fast loading
- **Caching** - Browser caching for static assets
- **Code Splitting** - Route-based code splitting

## 🎯 Future Enhancements

- [ ] Add more AI-enhanced projects
- [ ] Implement advanced filtering
- [ ] Add comparison features
- [ ] Export functionality
- [ ] Real-time updates

## 📝 License

This project is part of the Real Estate Analytics Platform.

---

**Built with ❤️ for real estate professionals**
