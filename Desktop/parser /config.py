import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # URL сайту
    BASE_URL = "https://azuldevelopments.com/en"
    
    # Дані для авторизації
    LOGIN_EMAIL = "info@property-partners.es"
    LOGIN_PASSWORD = "Partners@12"
    
    # Налаштування браузера
    HEADLESS = True  # Запуск в фоновому режимі
    BROWSER_TIMEOUT = 30
    
    # Налаштування парсера
    REQUEST_DELAY = 2  # Затримка між запитами (секунди)
    MAX_RETRIES = 3
    
    # User-Agent
    USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    
    # Налаштування скріншотів
    SAVE_SCREENSHOTS = True  # Зберігати скріншоти для діагностики
    SCREENSHOTS_DIR = "screenshots"  # Папка для скріншотів
    
    # Налаштування сесії
    SESSION_FILE = "data/session_cookies.json"  # Файл для збереження cookies
    SESSION_DURATION = 6 * 60 * 60  # Тривалість сесії в секундах (6 годин)
    
    # Структура проекту
    PROJECT_STRUCTURE = {
        'json_files': ['initial.json', 'full_info.json', 'structured.json'],
        'content_blocks': [
            'general_info',
            'media',
            'price_availability', 
            'plans',
            'quality_specs',
            'brochure',
            'location'
        ],
        'media_subfolders': ['renders', 'pictures', 'videos']
    }
