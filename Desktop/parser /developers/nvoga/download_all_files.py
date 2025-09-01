import json
import os
import requests
import time
from pathlib import Path
from auth_manager import NvogaAuthManager

class FileDownloader:
    def __init__(self):
        self.auth_manager = NvogaAuthManager()
        self.project_name = "imagine-by-marein"
        self.project_dir = f"projects/{self.project_name}"
        self.initial_file = f"{self.project_dir}/initial.json"
        self.downloads_dir = f"{self.project_dir}/downloaded_files"
        
    def load_initial_data(self) -> dict:
        """Load the initial parsed data"""
        if not os.path.exists(self.initial_file):
            raise FileNotFoundError(f"Initial data file not found: {self.initial_file}")
            
        with open(self.initial_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def download_file(self, url: str, local_path: str) -> bool:
        """Download a single file"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            
            # Download file
            response = self.auth_manager.session.get(url, stream=True)
            response.raise_for_status()
            
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to download {url}: {e}")
            return False
    
    def get_all_image_urls(self, data: dict) -> list:
        """Extract all image URLs from the data"""
        urls = []
        
        # Renders
        renders = data.get("renders", {}).get("render_documents", [])
        for render in renders:
            urls.append({
                "url": render["full_image_url"],
                "type": "render",
                "title": render["title"],
                "render_type": render.get("render_type", "Unknown")
            })
            if render.get("thumbnail_url"):
                urls.append({
                    "url": render["thumbnail_url"],
                    "type": "render_thumbnail",
                    "title": render["title"],
                    "render_type": render.get("render_type", "Unknown")
                })
        
        # Plans
        plans = data.get("plans", {}).get("plan_documents", [])
        for plan in plans:
            urls.append({
                "url": plan["full_image_url"],
                "type": "plan",
                "title": plan["title"],
                "villa_type": plan.get("villa_type", "Unknown")
            })
            if plan.get("thumbnail_url"):
                urls.append({
                    "url": plan["thumbnail_url"],
                    "type": "plan_thumbnail",
                    "title": plan["title"],
                    "villa_type": plan.get("villa_type", "Unknown")
                })
        
        # Quality specifications
        qualities = data.get("brochure_qualities", {}).get("qualities", {}).get("specifications", [])
        for quality in qualities:
            urls.append({
                "url": quality["full_image_url"],
                "type": "quality",
                "title": quality["title"],
                "page_number": quality.get("page_number", "Unknown")
            })
            if quality.get("thumbnail_url"):
                urls.append({
                    "url": quality["thumbnail_url"],
                    "type": "quality_thumbnail",
                    "title": quality["title"],
                    "page_number": quality.get("page_number", "Unknown")
                })
        
        # Price documents
        prices = data.get("prices_payment_terms", {}).get("sales_conditions", [])
        for price in prices:
            urls.append({
                "url": price["full_image_url"],
                "type": "price",
                "title": price["title"],
                "villa_type": price.get("villa_type", "Unknown")
            })
            if price.get("thumbnail_url"):
                urls.append({
                    "url": price["thumbnail_url"],
                    "type": "price_thumbnail",
                    "title": price["title"],
                    "villa_type": price.get("villa_type", "Unknown")
                })
        
        return urls
    
    def sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe saving"""
        # Remove or replace invalid characters
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        
        # Limit length
        if len(filename) > 200:
            filename = filename[:200]
        
        return filename
    
    def download_all_files(self):
        """Download all project files"""
        print(f"📥 Starting download of all files for project: {self.project_name}")
        
        # Load data
        data = self.load_initial_data()
        
        # Get all URLs
        urls = self.get_all_image_urls(data)
        print(f"📋 Found {len(urls)} files to download")
        
        # Create downloads directory
        os.makedirs(self.downloads_dir, exist_ok=True)
        
        # Download files
        successful_downloads = 0
        failed_downloads = 0
        
        for i, file_info in enumerate(urls, 1):
            url = file_info["url"]
            file_type = file_info["type"]
            title = file_info["title"]
            
            print(f"📥 Downloading {i}/{len(urls)}: {title}")
            
            # Create filename
            filename = self.sanitize_filename(title)
            extension = ".jpg" if "thumbnail" in file_type else ".jpg"
            local_filename = f"{filename}{extension}"
            
            # Create subdirectory based on type
            subdir = file_type.replace("_thumbnail", "")
            local_path = os.path.join(self.downloads_dir, subdir, local_filename)
            
            # Download file
            if self.download_file(url, local_path):
                successful_downloads += 1
                print(f"   ✅ Downloaded: {local_filename}")
            else:
                failed_downloads += 1
                print(f"   ❌ Failed: {local_filename}")
            
            # Add small delay to be respectful
            time.sleep(0.5)
        
        # Create download summary
        summary = {
            "total_files": len(urls),
            "successful_downloads": successful_downloads,
            "failed_downloads": failed_downloads,
            "download_directory": self.downloads_dir,
            "download_time": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Save summary
        summary_file = os.path.join(self.downloads_dir, "download_summary.json")
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"\n🎉 Download completed!")
        print(f"📊 Summary:")
        print(f"   - Total files: {summary['total_files']}")
        print(f"   - Successful: {summary['successful_downloads']}")
        print(f"   - Failed: {summary['failed_downloads']}")
        print(f"   - Directory: {summary['download_directory']}")
        
        return summary
    
    def create_file_index(self):
        """Create an index of all downloaded files"""
        print("📋 Creating file index...")
        
        index = {
            "project": self.project_name,
            "download_directory": self.downloads_dir,
            "files": []
        }
        
        # Scan downloaded files
        for root, dirs, files in os.walk(self.downloads_dir):
            for file in files:
                if file.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, self.downloads_dir)
                    
                    file_info = {
                        "filename": file,
                        "path": relative_path,
                        "full_path": file_path,
                        "type": os.path.basename(root),
                        "size": os.path.getsize(file_path)
                    }
                    
                    index["files"].append(file_info)
        
        # Save index
        index_file = os.path.join(self.downloads_dir, "file_index.json")
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False, indent=2)
        
        print(f"✅ File index created: {index_file}")
        print(f"📁 Total files indexed: {len(index['files'])}")
        
        return index
    
    def run(self):
        """Main execution method"""
        try:
            # Download all files
            summary = self.download_all_files()
            
            # Create file index
            index = self.create_file_index()
            
            print("\n🚀 All files downloaded and indexed successfully!")
            print("🤖 Ready for AI analysis!")
            
        except Exception as e:
            print(f"❌ Download failed: {e}")
            raise

if __name__ == "__main__":
    downloader = FileDownloader()
    downloader.run()
