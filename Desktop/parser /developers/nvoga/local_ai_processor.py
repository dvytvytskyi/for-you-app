import json
import os
import requests
import base64
import time
from typing import Dict, List, Any
from pathlib import Path

class LocalAIProcessor:
    def __init__(self):
        self.project_name = "imagine-by-marein"
        self.project_dir = f"projects/{self.project_name}"
        self.downloads_dir = f"{self.project_dir}/downloaded_files"
        self.structured_file = f"{self.project_dir}/structured.json"
        
        # Google AI Studio configuration
        self.google_ai_url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
        self.api_key = "AIzaSyD9w5CwjVXsiWEX3baw9Ir2-5p9iPrxIPM"
        
    def load_file_index(self) -> Dict[str, Any]:
        """Load the file index"""
        index_file = os.path.join(self.downloads_dir, "file_index.json")
        if not os.path.exists(index_file):
            raise FileNotFoundError(f"File index not found: {index_file}")
            
        with open(index_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def read_image_file(self, file_path: str) -> bytes:
        """Read image file from local path"""
        try:
            with open(file_path, 'rb') as f:
                return f.read()
        except Exception as e:
            print(f"❌ Failed to read image {file_path}: {e}")
            return None
    
    def encode_image(self, image_data: bytes) -> str:
        """Encode image to base64"""
        return base64.b64encode(image_data).decode('utf-8')
    
    def analyze_image_with_ai(self, file_path: str, context: str = "") -> Dict[str, Any]:
        """Analyze image using Google AI Studio"""
        print(f"🤖 Analyzing: {os.path.basename(file_path)}")
        
        # Read image file
        image_data = self.read_image_file(file_path)
        if not image_data:
            return {"error": "Failed to read image file"}
        
        # Encode image
        encoded_image = self.encode_image(image_data)
        
        # Prepare prompt
        prompt = f"""
        Analyze this real estate image and provide detailed information in JSON format.
        
        Context: {context}
        
        Please provide:
        1. Image type (render, photo, plan, document, etc.)
        2. Room/area type (if applicable)
        3. Key features visible
        4. Style and design elements
        5. Quality assessment
        6. Any text or labels visible
        7. Overall impression
        
        Return only valid JSON without any additional text.
        """
        
        # Prepare request payload
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": encoded_image
                        }
                    }
                ]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "topK": 32,
                "topP": 1,
                "maxOutputTokens": 2048,
            }
        }
        
        try:
            response = requests.post(
                f"{self.google_ai_url}?key={self.api_key}",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            result = response.json()
            if "candidates" in result and result["candidates"]:
                content = result["candidates"][0]["content"]["parts"][0]["text"]
                try:
                    # Try to parse as JSON
                    return json.loads(content)
                except json.JSONDecodeError:
                    # If not JSON, return as text
                    return {"analysis": content}
            else:
                return {"error": "No analysis generated"}
                
        except Exception as e:
            print(f"❌ AI analysis failed: {e}")
            return {"error": str(e)}
    
    def process_files_by_type(self, file_index: Dict[str, Any], file_type: str) -> List[Dict[str, Any]]:
        """Process files of a specific type with AI analysis"""
        print(f"🔍 Processing {file_type} files...")
        
        files = [f for f in file_index["files"] if f["type"] == file_type]
        processed_files = []
        
        for i, file_info in enumerate(files, 1):
            print(f"   Processing {i}/{len(files)}: {file_info['filename']}")
            
            # AI analysis
            ai_analysis = self.analyze_image_with_ai(
                file_info["full_path"],
                f"{file_type.title()} file: {file_info['filename']}"
            )
            
            processed_file = {
                **file_info,
                "ai_analysis": ai_analysis,
                "processed": True
            }
            processed_files.append(processed_file)
            
            # Add delay to avoid rate limits
            time.sleep(2)
        
        return processed_files
    
    def create_ai_enhanced_json(self) -> Dict[str, Any]:
        """Create AI-enhanced structured JSON"""
        print("🤖 Starting AI processing of local files...")
        
        # Load file index
        file_index = self.load_file_index()
        
        # Process different file types
        renders = self.process_files_by_type(file_index, "render")
        plans = self.process_files_by_type(file_index, "plan")
        qualities = self.process_files_by_type(file_index, "quality")
        prices = self.process_files_by_type(file_index, "price")
        
        # Create structured data
        structured_data = {
            "project_info": {
                "name": "Imagine by Marein",
                "slug": self.project_name,
                "location": "Bel Air, Estepona, Costa del Sol",
                "price_range": "2.890.000€",
                "units": 15,
                "type": "Exclusive Villas",
                "ai_processed_at": time.strftime("%Y-%m-%d %H:%M:%S")
            },
            "description": {
                "key_features": [
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
                ],
                "amenities": [
                    "Anantara Villa Padierna Palace Hotel & Golf Resort",
                    "METT Hotel & Beach Resort",
                    "Shops and restaurants",
                    "Schools",
                    "Golden beaches",
                    "Top-tier golf courses",
                    "5-star hotels",
                    "Exclusive beach clubs"
                ]
            },
            "renders": {
                "summary": {
                    "total_count": len(renders),
                    "processed_with_ai": True
                },
                "documents": renders
            },
            "plans": {
                "summary": {
                    "total_count": len(plans),
                    "processed_with_ai": True
                },
                "documents": plans
            },
            "qualities": {
                "summary": {
                    "total_count": len(qualities),
                    "processed_with_ai": True
                },
                "documents": qualities
            },
            "prices": {
                "summary": {
                    "total_count": len(prices),
                    "processed_with_ai": True
                },
                "documents": prices
            },
            "statistics": {
                "total_files": len(file_index["files"]),
                "total_processed": len(renders) + len(plans) + len(qualities) + len(prices),
                "villa_types": 6,
                "render_types": 10,
                "quality_pages": 13,
                "plan_pages_per_villa": 5
            },
            "metadata": {
                "source": "NVOGA Portal",
                "processing_method": "Local AI Analysis",
                "data_structure": "AI-Enhanced JSON",
                "version": "2.0",
                "completeness": "Complete with AI Analysis"
            }
        }
        
        return structured_data
    
    def save_ai_enhanced_data(self, structured_data: Dict[str, Any]):
        """Save AI-enhanced data to JSON file"""
        os.makedirs(self.project_dir, exist_ok=True)
        
        with open(self.structured_file, 'w', encoding='utf-8') as f:
            json.dump(structured_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ AI-enhanced data saved to {self.structured_file}")
    
    def run(self):
        """Main execution method"""
        print(f"🤖 Starting local AI processing for project: {self.project_name}")
        print(f"🔑 Using Google AI API key: {self.api_key[:10]}...")
        
        try:
            # Create AI-enhanced structured data
            structured_data = self.create_ai_enhanced_json()
            
            # Save to file
            self.save_ai_enhanced_data(structured_data)
            
            print("🎉 AI processing completed successfully!")
            print(f"📊 Statistics:")
            print(f"   - Total files processed: {structured_data['statistics']['total_processed']}")
            print(f"   - Renders analyzed: {len(structured_data['renders']['documents'])}")
            print(f"   - Plans analyzed: {len(structured_data['plans']['documents'])}")
            print(f"   - Qualities analyzed: {len(structured_data['qualities']['documents'])}")
            print(f"   - Prices analyzed: {len(structured_data['prices']['documents'])}")
            
        except Exception as e:
            print(f"❌ AI processing failed: {e}")
            raise

if __name__ == "__main__":
    processor = LocalAIProcessor()
    processor.run()
