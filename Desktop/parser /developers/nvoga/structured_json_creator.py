import json
import os
from typing import Dict, List, Any
from datetime import datetime

class StructuredJSONCreator:
    def __init__(self):
        self.project_name = "imagine-by-marein"
        self.project_dir = f"projects/{self.project_name}"
        self.initial_file = f"{self.project_dir}/initial.json"
        self.structured_file = f"{self.project_dir}/structured.json"
        
    def load_initial_data(self) -> Dict[str, Any]:
        """Load the initial parsed data"""
        if not os.path.exists(self.initial_file):
            raise FileNotFoundError(f"Initial data file not found: {self.initial_file}")
            
        with open(self.initial_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def extract_render_types(self, renders_data: Dict[str, Any]) -> List[str]:
        """Extract unique render types"""
        render_documents = renders_data.get("render_documents", [])
        types = set()
        for render in render_documents:
            render_type = render.get("render_type")
            if render_type:
                types.add(render_type)
        return sorted(list(types))
    
    def extract_villa_types(self, plans_data: Dict[str, Any]) -> List[str]:
        """Extract unique villa types from plans"""
        plan_documents = plans_data.get("plan_documents", [])
        types = set()
        for plan in plan_documents:
            villa_type = plan.get("villa_type")
            if villa_type:
                types.add(villa_type)
        return sorted(list(types))
    
    def extract_price_villa_types(self, prices_data: Dict[str, Any]) -> List[str]:
        """Extract unique villa types from prices"""
        sales_conditions = prices_data.get("sales_conditions", [])
        types = set()
        for price_doc in sales_conditions:
            villa_type = price_doc.get("villa_type")
            if villa_type:
                types.add(villa_type)
        return sorted(list(types))
    
    def calculate_total_documents(self, data: Dict[str, Any]) -> int:
        """Calculate total number of documents"""
        total = 0
        total += len(data.get("renders", {}).get("render_documents", []))
        total += len(data.get("plans", {}).get("plan_documents", []))
        total += len(data.get("brochure_qualities", {}).get("qualities", {}).get("specifications", []))
        total += len(data.get("prices_payment_terms", {}).get("sales_conditions", []))
        return total
    
    def calculate_total_images(self, data: Dict[str, Any]) -> int:
        """Calculate total number of images"""
        total = 0
        total += len(data.get("renders", {}).get("render_documents", []))
        total += len(data.get("plans", {}).get("plan_documents", []))
        total += len(data.get("brochure_qualities", {}).get("qualities", {}).get("specifications", []))
        total += len(data.get("prices_payment_terms", {}).get("sales_conditions", []))
        return total
    
    def extract_key_features_from_text(self, text: str) -> List[str]:
        """Extract key features from project description"""
        features = [
            "Private enclave of 15 exclusive villas",
            "Southeast-facing villas", 
            "Two spacious levels with basement option",
            "High-end finishes",
            "Private swimming pools",
            "Lush private gardens",
            "Sea views from upper floors",
            "Private parking for two vehicles",
            "Electric car charging station",
            "Gated community"
        ]
        
        # Filter features that appear in the text
        found_features = []
        for feature in features:
            if feature.lower() in text.lower():
                found_features.append(feature)
        
        return found_features
    
    def extract_amenities_from_text(self, text: str) -> List[str]:
        """Extract amenities from project description"""
        amenities = [
            "Anantara Villa Padierna Palace Hotel & Golf Resort",
            "METT Hotel & Beach Resort", 
            "Shops and restaurants",
            "Schools",
            "Golden beaches",
            "Top-tier golf courses",
            "5-star hotels",
            "Exclusive beach clubs"
        ]
        
        # Filter amenities that appear in the text
        found_amenities = []
        for amenity in amenities:
            if amenity.lower() in text.lower():
                found_amenities.append(amenity)
        
        return found_amenities
    
    def create_structured_json(self) -> Dict[str, Any]:
        """Create comprehensive structured JSON"""
        print("📋 Creating structured JSON from parsed data...")
        
        # Load initial data
        initial_data = self.load_initial_data()
        
        # Extract description text
        description_text = initial_data.get("description", {}).get("clean_text", "")
        
        # Create structured data
        structured_data = {
            "project_info": {
                "name": "Imagine by Marein",
                "slug": self.project_name,
                "location": "Bel Air, Estepona, Costa del Sol",
                "price_range": "2.890.000€",
                "units": 15,
                "type": "Exclusive Villas",
                "parsed_at": initial_data.get("parsed_at"),
                "structured_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            "description": {
                "full_text": initial_data.get("description", {}).get("full_text"),
                "clean_text": initial_data.get("description", {}).get("clean_text"),
                "key_features": self.extract_key_features_from_text(description_text),
                "amenities": self.extract_amenities_from_text(description_text)
            },
            "renders": {
                "summary": {
                    "total_count": len(initial_data.get("renders", {}).get("render_documents", [])),
                    "types": self.extract_render_types(initial_data.get("renders", {})),
                    "processed": True
                },
                "documents": initial_data.get("renders", {}).get("render_documents", [])
            },
            "plans": {
                "summary": {
                    "total_count": len(initial_data.get("plans", {}).get("plan_documents", [])),
                    "villa_types": self.extract_villa_types(initial_data.get("plans", {})),
                    "processed": True
                },
                "documents": initial_data.get("plans", {}).get("plan_documents", [])
            },
            "qualities": {
                "summary": {
                    "total_count": len(initial_data.get("brochure_qualities", {}).get("qualities", {}).get("specifications", [])),
                    "processed": True
                },
                "documents": initial_data.get("brochure_qualities", {}).get("qualities", {}).get("specifications", [])
            },
            "prices": {
                "summary": {
                    "total_count": len(initial_data.get("prices_payment_terms", {}).get("sales_conditions", [])),
                    "villa_types": self.extract_price_villa_types(initial_data.get("prices_payment_terms", {})),
                    "processed": True
                },
                "documents": initial_data.get("prices_payment_terms", {}).get("sales_conditions", [])
            },
            "downloads": {
                "brochure": initial_data.get("brochure_qualities", {}).get("brochure", {}),
                "qualities": initial_data.get("brochure_qualities", {}).get("qualities", {}),
                "prices": initial_data.get("prices_payment_terms", {}).get("prices", {}),
                "payment_terms": initial_data.get("prices_payment_terms", {}).get("payment_terms", {}),
                "plans": initial_data.get("plans", {}).get("plans", {}),
                "master_plan": initial_data.get("plans", {}).get("master_plan", {}),
                "renders": initial_data.get("renders", {}).get("renders", {})
            },
            "statistics": {
                "total_documents": self.calculate_total_documents(initial_data),
                "total_images": self.calculate_total_images(initial_data),
                "villa_types": 6,  # Villa 05-10
                "render_types": len(self.extract_render_types(initial_data.get("renders", {}))),
                "quality_pages": 13,
                "plan_pages_per_villa": 5
            },
            "metadata": {
                "source": "NVOGA Portal",
                "parsing_method": "Automated web scraping",
                "data_structure": "Structured JSON",
                "version": "1.0",
                "completeness": "Complete"
            }
        }
        
        return structured_data
    
    def save_structured_data(self, structured_data: Dict[str, Any]):
        """Save structured data to JSON file"""
        os.makedirs(self.project_dir, exist_ok=True)
        
        with open(self.structured_file, 'w', encoding='utf-8') as f:
            json.dump(structured_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Structured data saved to {self.structured_file}")
    
    def run(self):
        """Main execution method"""
        print(f"📋 Creating structured JSON for project: {self.project_name}")
        
        try:
            # Create structured data
            structured_data = self.create_structured_json()
            
            # Save to file
            self.save_structured_data(structured_data)
            
            print("🎉 Structured JSON creation completed successfully!")
            print(f"📊 Statistics:")
            print(f"   - Total documents: {structured_data['statistics']['total_documents']}")
            print(f"   - Total images: {structured_data['statistics']['total_images']}")
            print(f"   - Villa types: {structured_data['statistics']['villa_types']}")
            print(f"   - Render types: {structured_data['statistics']['render_types']}")
            print(f"   - Quality pages: {structured_data['statistics']['quality_pages']}")
            print(f"   - Key features found: {len(structured_data['description']['key_features'])}")
            print(f"   - Amenities found: {len(structured_data['description']['amenities'])}")
            
        except Exception as e:
            print(f"❌ Structured JSON creation failed: {e}")
            raise

if __name__ == "__main__":
    creator = StructuredJSONCreator()
    creator.run()
