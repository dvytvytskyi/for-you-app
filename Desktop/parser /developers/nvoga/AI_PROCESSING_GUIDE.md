# 🤖 AI Processing Guide - Google AI Studio

## 📋 Overview

This guide explains how to use Google AI Studio to analyze all project files and photos, creating a comprehensive AI-enhanced JSON structure.

## 🔧 Setup

### 1. Google AI Studio API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing
3. Get your API key from the API section
4. Set as environment variable:

```bash
export GOOGLE_AI_API_KEY="your_api_key_here"
```

### 2. Install Dependencies

```bash
pip install requests google-generativeai
```

## 🚀 Usage

### Option 1: Full AI Processing (Recommended)

```bash
# Set your API key
export GOOGLE_AI_API_KEY="your_api_key_here"

# Run AI processor
python ai_processor.py
```

This will:
- Download all images from the project
- Analyze each image with Google AI Studio
- Create comprehensive JSON with AI insights
- Save to `projects/imagine-by-marein/structured.json`

### Option 2: Structured JSON Only (No AI)

```bash
# Create structured JSON without AI analysis
python structured_json_creator.py
```

This creates a clean, structured JSON from parsed data without AI analysis.

## 📊 What AI Analysis Provides

### For Renders (34 images):
- Image type classification
- Room/area identification
- Style and design analysis
- Quality assessment
- Key features detection
- Overall impression

### For Floor Plans (30 images):
- Plan type identification
- Room layout analysis
- Villa type classification
- Measurements and dimensions
- Design features

### For Quality Specifications (13 images):
- Document type classification
- Content analysis
- Quality standards identification
- Material specifications
- Technical details

### For Price Documents (6 images):
- Document type classification
- Price information extraction
- Villa type identification
- Payment terms analysis
- Sales conditions

## 📁 Output Structure

```json
{
  "project_info": {
    "name": "Imagine by Marein",
    "slug": "imagine-by-marein",
    "location": "Bel Air, Estepona, Costa del Sol",
    "price_range": "2.890.000€",
    "units": 15,
    "type": "Exclusive Villas"
  },
  "description": {
    "full_text": "...",
    "clean_text": "...",
    "key_features": [...],
    "amenities": [...]
  },
  "renders": {
    "summary": {
      "total_count": 34,
      "types": [...],
      "processed_with_ai": true
    },
    "documents": [
      {
        "thumbnail_url": "...",
        "full_image_url": "...",
        "title": "...",
        "render_type": "...",
        "ai_analysis": {
          "image_type": "render",
          "room_type": "kitchen",
          "key_features": [...],
          "style": "...",
          "quality": "...",
          "overall_impression": "..."
        }
      }
    ]
  },
  "plans": {
    "summary": {
      "total_count": 30,
      "villa_types": [...],
      "processed_with_ai": true
    },
    "documents": [...]
  },
  "qualities": {
    "summary": {
      "total_count": 13,
      "processed_with_ai": true
    },
    "documents": [...]
  },
  "prices": {
    "summary": {
      "total_count": 6,
      "villa_types": [...],
      "processed_with_ai": true
    },
    "documents": [...]
  },
  "statistics": {
    "total_documents": 83,
    "total_images": 83,
    "villa_types": 6,
    "render_types": 10,
    "quality_pages": 13,
    "plan_pages_per_villa": 5
  }
}
```

## ⚡ Performance Tips

### 1. Batch Processing
- Process images in batches to avoid rate limits
- Use delays between requests if needed

### 2. Error Handling
- Images that fail to download are skipped
- AI analysis errors are logged but don't stop processing

### 3. Memory Management
- Images are downloaded and processed one at a time
- Base64 encoding is done efficiently

## 🔍 AI Analysis Examples

### Render Analysis Example:
```json
{
  "ai_analysis": {
    "image_type": "render",
    "room_type": "kitchen",
    "key_features": [
      "Modern kitchen design",
      "High-end appliances",
      "Natural light",
      "Open concept layout"
    ],
    "style": "Contemporary luxury",
    "quality": "High-end finishes",
    "overall_impression": "Premium kitchen with excellent functionality"
  }
}
```

### Floor Plan Analysis Example:
```json
{
  "ai_analysis": {
    "image_type": "floor_plan",
    "room_type": "villa_layout",
    "key_features": [
      "Open living area",
      "Master bedroom with ensuite",
      "Kitchen with dining area",
      "Private terrace"
    ],
    "style": "Modern villa design",
    "quality": "Well-planned layout",
    "overall_impression": "Efficient use of space with luxury amenities"
  }
}
```

## 📈 Statistics

### Current Project: "Imagine by Marein"
- **Total Documents**: 83
- **Total Images**: 83
- **Villa Types**: 6 (Villa 05-10)
- **Render Types**: 10 different categories
- **Quality Pages**: 13 specification pages
- **Plan Pages**: 5 per villa

### Processing Time Estimate
- **Without AI**: ~30 seconds
- **With AI**: ~10-15 minutes (depending on API response time)

## 🛠️ Troubleshooting

### Common Issues:

1. **API Key Not Set**
   ```
   ⚠️ Google AI API key not set. Skipping AI analysis.
   ```
   Solution: Set `GOOGLE_AI_API_KEY` environment variable

2. **Image Download Failed**
   ```
   ❌ Failed to download image: 404 Not Found
   ```
   Solution: Check if image URL is still valid

3. **AI Analysis Failed**
   ```
   ❌ AI analysis failed: Rate limit exceeded
   ```
   Solution: Add delays between requests or upgrade API plan

## 🎯 Next Steps

1. **Set up Google AI Studio API key**
2. **Run AI processor**: `python ai_processor.py`
3. **Review AI analysis results**
4. **Use structured JSON for frontend/backend integration**

## 📝 Notes

- AI analysis adds significant value but increases processing time
- All original data is preserved alongside AI insights
- Structured JSON is compatible with frontend applications
- Error handling ensures robust processing
