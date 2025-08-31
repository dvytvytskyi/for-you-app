import time
import json
import os
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from config import Config
import re
from datetime import datetime

class ProjectParser:
    def __init__(self, driver):
        self.driver = driver
        self.projects = []
        self.projects_dir = "projects"
        self.data_dir = "data"
        
        # Створюємо папку для скріншотів, якщо її немає
        if Config.SAVE_SCREENSHOTS and not os.path.exists(Config.SCREENSHOTS_DIR):
            os.makedirs(Config.SCREENSHOTS_DIR)
    
    def save_screenshot(self, filename):
        """Збереження скріншота в папку screenshots"""
        if Config.SAVE_SCREENSHOTS and self.driver:
            filepath = os.path.join(Config.SCREENSHOTS_DIR, filename)
            self.driver.save_screenshot(filepath)
            print(f"Скріншот збережено: {filepath}")
            return filepath
        return None
        
    def get_projects_list(self):
        """Отримання списку всіх проектів"""
        try:
            print("Отримую список проектів...")
            
            # Зберігаємо скріншот поточної сторінки
            self.save_screenshot("current_page.png")
            
            # Переходимо на сторінку з проектами
            projects_url = "https://azuldevelopments.com/en/proyectos-obra-nueva-costa-sol"
            print(f"Переходимо на: {projects_url}")
            self.driver.get(projects_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проектів
            self.save_screenshot("projects_page.png")
            
            # Парсимо список проектів з правильної структури
            projects_data = []
            
            # Додаємо діагностику - виводимо HTML структуру
            print("Аналізуємо структуру сторінки...")
            
            # Спробуємо різні підходи до пошуку проектів
            project_selectors = [
                # Селектори для кнопок "SHOW DETAILS" (найкращі)
                "//div[contains(@class, 'ver_detalles_b')]",
                "//a[contains(text(), 'SHOW DETAILS')]/parent::*",
                "//a[contains(text(), 'SHOW DETAILS')]/parent::*/parent::*",
                "//a[contains(text(), 'SHOW DETAILS')]/parent::*/parent::*/parent::*",
                # Селектори для заголовків проектів
                "//h3[contains(text(), 'MARBELLA') or contains(text(), 'ESTEPONA') or contains(text(), 'BENALMÁDENA') or contains(text(), 'MANILVA') or contains(text(), 'ALMUÑECAR') or contains(text(), 'MÁLAGA') or contains(text(), 'ALMERÍMAR') or contains(text(), 'CAMPANILLAS') or contains(text(), 'ALGARROBO') or contains(text(), 'BENAJAFAFE') or contains(text(), 'TORRE DEL MAR') or contains(text(), 'SAN JUAN') or contains(text(), 'LA HERRADURA') or contains(text(), 'LOS ÁLAMOS') or contains(text(), 'LA CALA')]",
                "//h4[contains(text(), 'MARBELLA') or contains(text(), 'ESTEPONA') or contains(text(), 'BENALMÁDENA') or contains(text(), 'MANILVA') or contains(text(), 'ALMUÑECAR') or contains(text(), 'MÁLAGA') or contains(text(), 'ALMERÍMAR') or contains(text(), 'CAMPANILLAS') or contains(text(), 'ALGARROBO') or contains(text(), 'BENAJAFAFE') or contains(text(), 'TORRE DEL MAR') or contains(text(), 'SAN JUAN') or contains(text(), 'LA HERRADURA') or contains(text(), 'LOS ÁLAMOS') or contains(text(), 'LA CALA')]",
                "//h5[contains(text(), 'MARBELLA') or contains(text(), 'ESTEPONA') or contains(text(), 'BENALMÁDENA') or contains(text(), 'MANILVA') or contains(text(), 'ALMUÑECAR') or contains(text(), 'MÁLAGA') or contains(text(), 'ALMERÍMAR') or contains(text(), 'CAMPANILLAS') or contains(text(), 'ALGARROBO') or contains(text(), 'BENAJAFAFE') or contains(text(), 'TORRE DEL MAR') or contains(text(), 'SAN JUAN') or contains(text(), 'LA HERRADURA') or contains(text(), 'LOS ÁLAMOS') or contains(text(), 'LA CALA')]",
                # Селектори для всіх заголовків h3, h4, h5
                "//h3",
                "//h4", 
                "//h5",
                # Селектори для блоків з цінами
                "//div[contains(text(), '€') and contains(text(), 'from')]",
                "//div[contains(text(), '€') and contains(text(), 'desde')]",
                # Загальні селектори
                "//div[contains(@class, 'col')]",
                "//div[contains(@class, 'row')]//div",
                # Прямі селектори для проектів
                "//div[contains(@class, 'project')]",
                "//div[contains(@class, 'card')]",
                "//div[contains(@class, 'item')]",
                "//article"
            ]
            
            for i, selector in enumerate(project_selectors):
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    print(f"Селектор {i+1}: '{selector}' - знайдено {len(elements)} елементів")
                    
                    if elements and len(elements) > 0:
                        # Показуємо перші кілька елементів для діагностики
                        for j, element in enumerate(elements[:3]):
                            try:
                                text = element.text.strip()
                                if text:
                                    print(f"  Елемент {j+1}: {text[:100]}...")
                            except:
                                pass
                        
                        # Якщо знайшли елементи, спробуємо їх обробити
                        if len(elements) > 0:  # Обробляємо всі знайдені елементи
                            print(f"Спроба обробки {len(elements)} елементів...")
                            for element in elements:
                                try:
                                    project_data = self._extract_project_basic_info(element)
                                    if project_data and project_data.get('name'):
                                        # Перевіряємо, чи не дублюється проект
                                        existing_names = [p.get('name') for p in projects_data]
                                        if project_data['name'] not in existing_names:
                                            projects_data.append(project_data)
                                            print(f"Додано проект: {project_data['name']}")
                                except Exception as e:
                                    continue
                            
                            # Якщо знайшли достатньо проектів, виходимо
                            if len(projects_data) >= 30:
                                break
                except Exception as e:
                    print(f"Помилка з селектором {i+1}: {str(e)}")
                    continue
            
            self.projects = projects_data
            print(f"Всього знайдено {len(projects_data)} проектів")
            return projects_data
            
        except Exception as e:
            print(f"Помилка отримання списку проектів: {str(e)}")
            return []
    
    def _extract_project_basic_info(self, project_element):
        """Витягування базової інформації про проект"""
        try:
            # Назва проекту
            name = ""
            try:
                # Якщо це заголовок, беремо його текст
                if project_element.tag_name in ['h3', 'h4', 'h5']:
                    name = project_element.text.strip()
                else:
                    # Шукаємо заголовок в елементі
                    name_element = project_element.find_element(By.XPATH, ".//h3 | .//h4 | .//h5 | .//strong")
                    name = name_element.text.strip()
            except:
                # Якщо не знайшли заголовок, шукаємо в тексті
                full_text = project_element.text.strip()
                lines = [line.strip() for line in full_text.split('\n') if line.strip()]
                if lines:
                    name = lines[0]
            
            # Якщо назва порожня або занадто коротка, пропускаємо
            if not name or len(name) < 3:
                return None
            
            # URL проекту
            project_url = ""
            try:
                # Шукаємо кнопку "SHOW DETAILS" в div з класом "ver_detalles_b"
                link_element = project_element.find_element(By.XPATH, ".//div[contains(@class, 'ver_detalles_b')]//a[contains(text(), 'SHOW DETAILS')]")
                project_url = link_element.get_attribute("href")
                print(f"✅ Знайдено URL для {name}: {project_url}")
            except:
                try:
                    # Альтернативний пошук кнопки "SHOW DETAILS"
                    link_element = project_element.find_element(By.XPATH, ".//a[contains(text(), 'SHOW DETAILS')]")
                    project_url = link_element.get_attribute("href")
                    print(f"✅ Знайдено URL (альтернативний) для {name}: {project_url}")
                except:
                    try:
                        # Шукаємо будь-яке посилання
                        link_element = project_element.find_element(By.XPATH, ".//a")
                        project_url = link_element.get_attribute("href")
                        print(f"⚠️ Знайдено загальне посилання для {name}: {project_url}")
                    except:
                        print(f"❌ Не знайдено посилання для {name}")
                        # Якщо URL не знайдено, спробуємо побудувати його
                        if name:
                            safe_name = name.lower().replace(' ', '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
                            safe_name = re.sub(r'[^a-z0-9-]', '', safe_name)
                            project_url = f"{Config.BASE_URL}/proyecto/{safe_name}"
                            print(f"🔧 Побудовано URL для {name}: {project_url}")
                        pass
            
            # Локація
            location = ""
            try:
                # Шукаємо локацію в тексті
                full_text = project_element.text.strip()
                lines = [line.strip() for line in full_text.split('\n') if line.strip()]
                
                # Шукаємо рядок з локацією (зазвичай другий або третій)
                for line in lines[1:4]:
                    if line and line != name and not '€' in line and not 'SHOW' in line:
                        location = line
                        break
            except:
                pass
            
            # Ціна
            price_from = ""
            try:
                # Шукаємо ціну в тексті
                full_text = project_element.text.strip()
                if '€' in full_text:
                    # Знаходимо рядок з ціною
                    lines = full_text.split('\n')
                    for line in lines:
                        if '€' in line and ('from' in line.lower() or 'desde' in line.lower()):
                            price_from = line.strip()
                            break
            except:
                pass
            
            # Статус розробки
            development_status = ""
            try:
                # Шукаємо статус в тексті
                full_text = project_element.text.strip()
                status_keywords = ['CONSTRUCTION', 'MARKETING', 'COMPLETION', 'FINISHED', 'UNDER CONSTRUCTION', 'MARKETING STAGE']
                for keyword in status_keywords:
                    if keyword in full_text:
                        development_status = keyword
                        break
            except:
                pass
            
            # Зображення
            image_url = ""
            try:
                img_element = project_element.find_element(By.XPATH, ".//img")
                image_url = img_element.get_attribute("src")
            except:
                pass
            
            return {
                "name": name,
                "url": project_url,
                "location": location,
                "price_from": price_from,
                "development_status": development_status,
                "image_url": image_url
            }
            
        except Exception as e:
            print(f"Помилка витягування базової інформації: {str(e)}")
            return None
    
    def get_project_details(self, project_url):
        """Отримання детальної інформації про проект"""
        try:
            print(f"Отримую деталі проекту: {project_url}")
            
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Парсимо детальну інформацію
            project_details = {
                "url": project_url,
                "basic_info": self._extract_basic_details(),
                "description": self._extract_description(),
                "specifications": self._extract_specifications(),
                "prices": self._extract_prices(),
                "images": self._extract_images(),
                "location_details": self._extract_location_details(),
                "contact_info": self._extract_contact_info()
            }
            
            return project_details
            
        except Exception as e:
            print(f"Помилка отримання деталей проекту: {str(e)}")
            return None
    
    def _extract_basic_details(self):
        """Витягування базової інформації"""
        try:
            basic_info = {}
            
            # Назва проекту
            try:
                title = self.driver.find_element(By.XPATH, "//h1 | //h2[contains(@class, 'title')]").text.strip()
                basic_info["title"] = title
            except:
                pass
            
            # Статус проекту
            try:
                status = self.driver.find_element(By.XPATH, "//span[contains(@class, 'status')] | //div[contains(@class, 'status')]").text.strip()
                basic_info["status"] = status
            except:
                pass
            
            # Тип нерухомості
            try:
                property_type = self.driver.find_element(By.XPATH, "//span[contains(@class, 'type')] | //div[contains(@class, 'type')]").text.strip()
                basic_info["property_type"] = property_type
            except:
                pass
            
            return basic_info
            
        except Exception as e:
            print(f"Помилка витягування базової інформації: {str(e)}")
            return {}
    
    def _extract_description(self):
        """Витягування опису проекту"""
        try:
            description_elements = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'description')] | //p[contains(@class, 'description')]")
            description = ""
            
            for element in description_elements:
                description += element.text.strip() + "\n"
            
            return description.strip()
            
        except Exception as e:
            print(f"Помилка витягування опису: {str(e)}")
            return ""
    
    def _extract_specifications(self):
        """Витягування специфікацій"""
        try:
            specs = {}
            
            # Шукаємо таблиці або списки з характеристиками
            spec_elements = self.driver.find_elements(By.XPATH, "//table | //ul[contains(@class, 'specs')] | //div[contains(@class, 'specifications')]")
            
            for element in spec_elements:
                try:
                    rows = element.find_elements(By.XPATH, ".//tr | .//li")
                    for row in rows:
                        try:
                            cells = row.find_elements(By.XPATH, ".//td | .//span")
                            if len(cells) >= 2:
                                key = cells[0].text.strip()
                                value = cells[1].text.strip()
                                if key and value:
                                    specs[key] = value
                        except:
                            continue
                except:
                    continue
            
            return specs
            
        except Exception as e:
            print(f"Помилка витягування специфікацій: {str(e)}")
            return {}
    
    def _extract_prices(self):
        """Витягування інформації про ціни"""
        try:
            prices = {}
            
            # Шукаємо елементи з цінами
            price_elements = self.driver.find_elements(By.XPATH, "//span[contains(@class, 'price')] | //div[contains(@class, 'price')] | //span[contains(text(), '€')]")
            
            for element in price_elements:
                try:
                    text = element.text.strip()
                    if '€' in text or 'EUR' in text:
                        # Спробуємо витягти тип ціни та значення
                        if 'from' in text.lower():
                            prices['price_from'] = text
                        elif 'to' in text.lower():
                            prices['price_to'] = text
                        else:
                            prices['price'] = text
                except:
                    continue
            
            return prices
            
        except Exception as e:
            print(f"Помилка витягування цін: {str(e)}")
            return {}
    
    def _extract_images(self):
        """Витягування зображень проекту"""
        try:
            images = []
            
            # Шукаємо всі зображення проекту
            img_elements = self.driver.find_elements(By.XPATH, "//img[contains(@class, 'project')] | //img[contains(@class, 'gallery')] | //img[contains(@alt, 'project')]")
            
            for img in img_elements:
                try:
                    src = img.get_attribute("src")
                    alt = img.get_attribute("alt") or ""
                    
                    if src and not src.endswith('.svg'):
                        images.append({
                            "url": src,
                            "alt": alt
                        })
                except:
                    continue
            
            return images
            
        except Exception as e:
            print(f"Помилка витягування зображень: {str(e)}")
            return []
    
    def _extract_location_details(self):
        """Витягування деталей локації"""
        try:
            location_info = {}
            
            # Адреса
            try:
                address = self.driver.find_element(By.XPATH, "//div[contains(@class, 'address')] | //span[contains(@class, 'address')]").text.strip()
                location_info["address"] = address
            except:
                pass
            
            # Координати (якщо є)
            try:
                map_element = self.driver.find_element(By.XPATH, "//iframe[contains(@src, 'maps')] | //div[contains(@class, 'map')]")
                map_src = map_element.get_attribute("src")
                if map_src:
                    location_info["map_url"] = map_src
            except:
                pass
            
            return location_info
            
        except Exception as e:
            print(f"Помилка витягування локації: {str(e)}")
            return {}
    
    def _extract_contact_info(self):
        """Витягування контактної інформації"""
        try:
            contact_info = {}
            
            # Телефон
            try:
                phone = self.driver.find_element(By.XPATH, "//a[contains(@href, 'tel:')]").get_attribute("href")
                contact_info["phone"] = phone.replace("tel:", "")
            except:
                pass
            
            # Email
            try:
                email = self.driver.find_element(By.XPATH, "//a[contains(@href, 'mailto:')]").get_attribute("href")
                contact_info["email"] = email.replace("mailto:", "")
            except:
                pass
            
            return contact_info
            
        except Exception as e:
            print(f"Помилка витягування контактів: {str(e)}")
            return {}
    
    def save_projects_to_file(self, filename="data/projects_data.json"):
        """Збереження даних проектів у файл"""
        try:
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.projects, f, ensure_ascii=False, indent=2)
            print(f"Дані збережено у файл: {filename}")
        except Exception as e:
            print(f"Помилка збереження файлу: {str(e)}")
    
    def create_project_folders(self):
        """
        Створює детальну структуру папок для всіх проектів
        """
        try:
            # Завантажуємо дані проектів
            projects_file = os.path.join(self.data_dir, 'all_projects.json')
            if not os.path.exists(projects_file):
                print("❌ Файл з проектами не знайдено. Спочатку запустіть парсинг проектів.")
                return 0
            
            with open(projects_file, 'r', encoding='utf-8') as f:
                projects_data = json.load(f)
            
            created_count = 0
            for project in projects_data:
                project_name = project.get('name', 'Unknown Project')
                
                # Створюємо детальну структуру для кожного проекту
                project_path = self.create_detailed_project_structure(project_name)
                if project_path:
                    created_count += 1
            
            print(f"📁 Створено детальну структуру для {created_count} проектів")
            return created_count
            
        except Exception as e:
            print(f"Помилка створення папок: {str(e)}")
            return 0

    def create_detailed_project_structure(self, project_name):
        """
        Створює детальну структуру папок для проекту з усіма необхідними підпапками
        """
        import os
        import json
        
        # Очищаємо назву проекту для використання як назва папки
        safe_name = self._sanitize_filename(project_name)
        project_path = os.path.join(self.projects_dir, safe_name)
        
        # Створюємо основну папку проекту
        os.makedirs(project_path, exist_ok=True)
        
        # Створюємо JSON файли
        json_files = Config.PROJECT_STRUCTURE['json_files']
        for json_file in json_files:
            json_path = os.path.join(project_path, json_file)
            if not os.path.exists(json_path):
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump({
                        "project_name": project_name,
                        "created_at": datetime.now().isoformat(),
                        "status": "empty"
                    }, f, indent=2, ensure_ascii=False)
        
        # Створюємо структуру all_files
        all_files_path = os.path.join(project_path, 'all_files')
        os.makedirs(all_files_path, exist_ok=True)
        
        # Основні блоки контенту
        content_blocks = Config.PROJECT_STRUCTURE['content_blocks']
        
        for block in content_blocks:
            block_path = os.path.join(all_files_path, block)
            os.makedirs(block_path, exist_ok=True)
        
        # Створюємо медіа папку з підпапками
        media_path = os.path.join(all_files_path, 'media')
        os.makedirs(media_path, exist_ok=True)
        
        media_subfolders = Config.PROJECT_STRUCTURE['media_subfolders']
        for subfolder in media_subfolders:
            subfolder_path = os.path.join(media_path, subfolder)
            os.makedirs(subfolder_path, exist_ok=True)
        
        # Створюємо структуру extracted_files
        extracted_path = os.path.join(project_path, 'extracted_files')
        os.makedirs(extracted_path, exist_ok=True)
        
        for block in content_blocks:
            block_path = os.path.join(extracted_path, block)
            os.makedirs(block_path, exist_ok=True)
        
        # Створюємо медіа папку в extracted_files
        extracted_media_path = os.path.join(extracted_path, 'media')
        os.makedirs(extracted_media_path, exist_ok=True)
        
        for subfolder in media_subfolders:
            subfolder_path = os.path.join(extracted_media_path, subfolder)
            os.makedirs(subfolder_path, exist_ok=True)
        
        print(f"✅ Створено детальну структуру для проекту: {project_name}")
        return project_path

    def _sanitize_filename(self, filename):
        """
        Очищає назву файлу від недопустимих символів
        """
        import re
        # Замінюємо недопустимі символи на підкреслення
        sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
        # Видаляємо зайві пробіли та підкреслення
        sanitized = re.sub(r'\s+', '_', sanitized.strip())
        sanitized = re.sub(r'_+', '_', sanitized)
        return sanitized

    def parse_project_general_info(self, project_name, project_url=None):
        """
        Парсить загальну інформацію проекту (general_info)
        Включає: description, development status, та інші загальні дані
        """
        try:
            print(f"🔍 Парсинг general_info для проекту: {project_name}")
            
            # Якщо URL не надано, шукаємо в базі проектів
            if not project_url:
                project_url = self._find_project_url(project_name)
                if not project_url:
                    print(f"❌ Не знайдено URL для проекту: {project_name}")
                    return False
            
            # Спочатку отримуємо дані з головної сторінки проектів
            main_page_data = self._get_project_data_from_main_page(project_name)
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_project_page.png")
            
            # Витягуємо загальну інформацію
            general_info = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "description": self._extract_description(),
                "development_status": main_page_data.get('development_status', ''),  # З головної сторінки
                "typical_units": main_page_data.get('property_type', ''),  # З головної сторінки
                "developer": self._extract_developer()
            }
            
            # Зберігаємо в initial.json
            self._save_general_info_to_json(project_name, general_info, "initial.json")
            
            # Зберігаємо в full_info.json (після обробки)
            processed_info = self._process_general_info(general_info)
            self._save_general_info_to_json(project_name, processed_info, "full_info.json")
            
            # Зберігаємо в structured.json (структурована інформація)
            structured_info = self._structure_general_info(processed_info)
            self._save_general_info_to_json(project_name, structured_info, "structured.json")
            
            print(f"✅ General_info збережено для проекту: {project_name}")
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу general_info для {project_name}: {str(e)}")
            return False

    def _find_project_url(self, project_name):
        """Знаходить URL проекту в базі даних"""
        try:
            projects_file = os.path.join(self.data_dir, 'all_projects.json')
            if os.path.exists(projects_file):
                with open(projects_file, 'r', encoding='utf-8') as f:
                    projects_data = json.load(f)
                
                for project in projects_data:
                    if project.get('name') == project_name:
                        return project.get('url')
            
            # Якщо не знайдено в файлі, спробуємо побудувати URL
            safe_name = project_name.lower().replace(' ', '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
            return f"{Config.BASE_URL}/proyecto/{safe_name}"
            
        except Exception as e:
            print(f"Помилка пошуку URL: {str(e)}")
            return None

    def _get_project_data_from_main_page(self, project_name):
        """
        Отримує дані проекту з головної сторінки проектів
        """
        try:
            print(f"📋 Отримую дані з головної сторінки для: {project_name}")
            
            # Переходимо на головну сторінку проектів
            projects_url = "https://azuldevelopments.com/en/proyectos-obra-nueva-costa-sol"
            self.driver.get(projects_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Шукаємо проект на сторінці
            project_data = self._find_project_on_main_page(project_name)
            
            if project_data:
                print(f"✅ Знайдено дані для {project_name}: {project_data}")
            else:
                print(f"❌ Не знайдено дані для {project_name} на головній сторінці")
                project_data = {}
            
            return project_data
            
        except Exception as e:
            print(f"Помилка отримання даних з головної сторінки: {str(e)}")
            return {}

    def _find_project_on_main_page(self, project_name):
        """
        Знаходить проект на головній сторінці та витягує його дані
        """
        try:
            # Шукаємо блок проекту за назвою
            project_selectors = [
                f"//h3[contains(text(), '{project_name}')]/parent::*/parent::*/parent::*",
                f"//h3[contains(text(), '{project_name}')]/parent::*/parent::*",
                f"//div[contains(text(), '{project_name}')]/parent::*/parent::*",
                f"//div[contains(text(), '{project_name}')]/parent::*"
            ]
            
            for selector in project_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    if elements:
                        for element in elements:
                            # Перевіряємо, чи це правильний проект
                            element_text = element.text.strip()
                            if project_name in element_text:
                                return self._extract_project_data_from_element(element, project_name)
                except:
                    continue
            
            return {}
            
        except Exception as e:
            print(f"Помилка пошуку проекту на головній сторінці: {str(e)}")
            return {}

    def _extract_project_data_from_element(self, element, project_name):
        """
        Витягує дані проекту з елемента на головній сторінці
        """
        try:
            data = {}
            element_text = element.text.strip()
            
            # Витягуємо development status
            status_keywords = ['UNDER CONSTRUCTION', 'MARKETING STAGE', 'COMPLETED', 'PRE-CONSTRUCTION', 'READY', 'FINISHED']
            for keyword in status_keywords:
                if keyword in element_text:
                    data['development_status'] = keyword
                    break
            
            # Витягуємо location (зазвичай це рядок після назви проекту)
            lines = element_text.split('\n')
            for i, line in enumerate(lines):
                if project_name in line and i + 1 < len(lines):
                    # Наступний рядок зазвичай містить локацію
                    location_line = lines[i + 1].strip()
                    if location_line and not any(keyword in location_line.upper() for keyword in ['BEDS', 'FROM', '€', 'SHOW']):
                        data['location'] = location_line
                        break
            
            # Витягуємо property type (зазвичай містить "BEDS")
            for line in lines:
                if 'BEDS' in line.upper():
                    data['property_type'] = line.strip()
                    break
            
            # Витягуємо price_from
            for line in lines:
                if '€' in line and ('from' in line.lower() or 'desde' in line.lower()):
                    data['price_from'] = line.strip()
                    break
            
            return data
            
        except Exception as e:
            print(f"Помилка витягування даних з елемента: {str(e)}")
            return {}

    def _extract_description(self):
        """Витягує опис проекту"""
        try:
            # Спробуємо різні селектори для опису
            description_selectors = [
                "//div[contains(@class, 'description')]",
                "//div[contains(@class, 'desc')]",
                "//p[contains(@class, 'description')]",
                "//div[contains(@class, 'content')]//p",
                "//section[contains(@class, 'description')]",
                "//div[contains(@class, 'project-description')]",
                "//div[contains(@class, 'about')]",
                "//div[contains(@class, 'info')]//p",
                "//article//p",
                "//div[contains(@class, 'text')]"
            ]
            
            for selector in description_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    if elements:
                        description = ""
                        for element in elements:
                            text = element.text.strip()
                            if text and len(text) > 20:  # Мінімальна довжина для опису
                                description += text + "\n"
                        
                        if description.strip():
                            return description.strip()
                except:
                    continue
            
            return ""
            
        except Exception as e:
            print(f"Помилка витягування опису: {str(e)}")
            return ""

    def _extract_development_status(self):
        """Витягує статус розробки проекту"""
        try:
            status_selectors = [
                "//span[contains(@class, 'status')]",
                "//div[contains(@class, 'status')]",
                "//span[contains(text(), 'UNDER CONSTRUCTION')]",
                "//span[contains(text(), 'COMPLETED')]",
                "//span[contains(text(), 'PRE-CONSTRUCTION')]",
                "//div[contains(text(), 'Status')]/following-sibling::*",
                "//strong[contains(text(), 'Status')]/following-sibling::*",
                "//span[contains(@class, 'badge')]",
                "//div[contains(@class, 'phase')]"
            ]
            
            for selector in status_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and any(keyword in text.upper() for keyword in ['CONSTRUCTION', 'COMPLETED', 'PRE-CONSTRUCTION', 'READY', 'FINISHED']):
                            return text
                except:
                    continue
            
            return ""
            
        except Exception as e:
            print(f"Помилка витягування статусу: {str(e)}")
            return ""

    def _extract_property_type(self):
        """Витягує тип нерухомості"""
        try:
            type_selectors = [
                "//span[contains(@class, 'type')]",
                "//div[contains(@class, 'type')]",
                "//span[contains(text(), 'APARTMENT')]",
                "//span[contains(text(), 'VILLA')]",
                "//span[contains(text(), 'PENTHOUSE')]",
                "//div[contains(text(), 'Type')]/following-sibling::*",
                "//strong[contains(text(), 'Type')]/following-sibling::*"
            ]
            
            for selector in type_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and any(keyword in text.upper() for keyword in ['APARTMENT', 'VILLA', 'PENTHOUSE', 'HOUSE', 'DUPLEX']):
                            return text
                except:
                    continue
            
            return ""
            
        except Exception as e:
            print(f"Помилка витягування типу: {str(e)}")
            return ""

    def _extract_developer(self):
        """Витягує інформацію про забудовника"""
        try:
            developer_selectors = [
                "//div[contains(text(), 'Developer')]/following-sibling::*",
                "//strong[contains(text(), 'Developer')]/following-sibling::*",
                "//span[contains(@class, 'developer')]",
                "//div[contains(@class, 'developer')]",
                "//div[contains(text(), 'Azul')]",
                "//div[contains(text(), 'Developments')]"
            ]
            
            for selector in developer_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and len(text) > 2:
                            return text
                except:
                    continue
            
            return "Azul Developments"
            
        except Exception as e:
            print(f"Помилка витягування забудовника: {str(e)}")
            return ""

    def _extract_completion_date(self):
        """Витягує дату завершення"""
        try:
            date_selectors = [
                "//div[contains(text(), 'Completion')]/following-sibling::*",
                "//strong[contains(text(), 'Completion')]/following-sibling::*",
                "//span[contains(@class, 'completion')]",
                "//div[contains(@class, 'completion')]",
                "//div[contains(text(), 'Ready')]/following-sibling::*",
                "//span[contains(text(), '2024')]",
                "//span[contains(text(), '2025')]",
                "//span[contains(text(), '2026')]"
            ]
            
            for selector in date_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and any(year in text for year in ['2024', '2025', '2026', '2027']):
                            return text
                except:
                    continue
            
            return ""
            
        except Exception as e:
            print(f"Помилка витягування дати: {str(e)}")
            return ""

    def _extract_total_units(self):
        """Витягує загальну кількість одиниць"""
        try:
            units_selectors = [
                "//div[contains(text(), 'Units')]/following-sibling::*",
                "//strong[contains(text(), 'Units')]/following-sibling::*",
                "//span[contains(@class, 'units')]",
                "//div[contains(@class, 'units')]",
                "//div[contains(text(), 'Total')]/following-sibling::*"
            ]
            
            for selector in units_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and any(char.isdigit() for char in text):
                            return text
                except:
                    continue
            
            return ""
            
        except Exception as e:
            print(f"Помилка витягування кількості одиниць: {str(e)}")
            return ""

    def _extract_location_details(self):
        """Витягує деталі локації"""
        try:
            location_selectors = [
                "//div[contains(@class, 'location')]",
                "//span[contains(@class, 'location')]",
                "//div[contains(text(), 'Location')]/following-sibling::*",
                "//strong[contains(text(), 'Location')]/following-sibling::*",
                "//div[contains(@class, 'address')]",
                "//span[contains(@class, 'address')]"
            ]
            
            for selector in location_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and len(text) > 5:
                            return text
                except:
                    continue
            
            return ""
            
        except Exception as e:
            print(f"Помилка витягування локації: {str(e)}")
            return ""

    def _extract_features(self):
        """Витягує особливості проекту"""
        try:
            features_selectors = [
                "//div[contains(@class, 'features')]//li",
                "//ul[contains(@class, 'features')]//li",
                "//div[contains(@class, 'amenities')]//li",
                "//ul[contains(@class, 'amenities')]//li",
                "//div[contains(text(), 'Features')]/following-sibling::*//li",
                "//strong[contains(text(), 'Features')]/following-sibling::*//li"
            ]
            
            features = []
            for selector in features_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and len(text) > 2:
                            features.append(text)
                except:
                    continue
            
            return features
            
        except Exception as e:
            print(f"Помилка витягування особливостей: {str(e)}")
            return []

    def _extract_highlights(self):
        """Витягує ключові моменти проекту"""
        try:
            highlights_selectors = [
                "//div[contains(@class, 'highlights')]//li",
                "//ul[contains(@class, 'highlights')]//li",
                "//div[contains(@class, 'key')]//li",
                "//ul[contains(@class, 'key')]//li",
                "//div[contains(text(), 'Highlights')]/following-sibling::*//li",
                "//strong[contains(text(), 'Highlights')]/following-sibling::*//li"
            ]
            
            highlights = []
            for selector in highlights_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and len(text) > 2:
                            highlights.append(text)
                except:
                    continue
            
            return highlights
            
        except Exception as e:
            print(f"Помилка витягування ключових моментів: {str(e)}")
            return []

    def _save_general_info_to_json(self, project_name, data, filename):
        """Зберігає general_info в JSON файл"""
        try:
            safe_name = self._sanitize_filename(project_name)
            project_path = os.path.join(self.projects_dir, safe_name)
            json_path = os.path.join(project_path, filename)
            
            # Якщо це initial.json, додаємо дані до існуючого файлу
            if filename == "initial.json":
                current_data = {}
                if os.path.exists(json_path):
                    with open(json_path, 'r', encoding='utf-8') as f:
                        current_data = json.load(f)
                
                # Додаємо general_info до існуючих даних
                current_data["general_info"] = data
                
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(current_data, f, indent=2, ensure_ascii=False)
            else:
                # Для інших файлів (full_info.json, structured.json) перезаписуємо
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Збережено {filename} для проекту: {project_name}")
            
        except Exception as e:
            print(f"Помилка збереження {filename}: {str(e)}")

    def _process_general_info(self, raw_info):
        """Обробляє сиру інформацію general_info"""
        processed = raw_info.copy()
        
        # Очищення та форматування опису
        if processed.get('description'):
            processed['description'] = processed['description'].strip()
        
        # Стандартизація статусу розробки
        if processed.get('development_status'):
            status = processed['development_status'].upper()
            if 'CONSTRUCTION' in status:
                processed['development_status'] = 'UNDER CONSTRUCTION'
            elif 'COMPLETED' in status or 'READY' in status:
                processed['development_status'] = 'COMPLETED'
            elif 'PRE-CONSTRUCTION' in status:
                processed['development_status'] = 'PRE-CONSTRUCTION'
        
        # Додаємо метадані
        processed['processed_at'] = datetime.now().isoformat()
        processed['data_quality'] = self._assess_data_quality(processed)
        
        return processed

    def _structure_general_info(self, processed_info):
        """Структурує оброблену інформацію general_info"""
        structured = {
            "project_metadata": {
                "name": processed_info.get('project_name'),
                "url": processed_info.get('url'),
                "parsed_at": processed_info.get('parsed_at'),
                "processed_at": processed_info.get('processed_at'),
                "data_quality": processed_info.get('data_quality')
            },
            "general_information": {
                "description": processed_info.get('description'),
                "development_status": processed_info.get('development_status'),
                "typical_units": processed_info.get('typical_units'),
                "developer": processed_info.get('developer')
            }
        }
        
        return structured

    def _assess_data_quality(self, data):
        """Оцінює якість даних"""
        quality_score = 0
        total_fields = 0
        
        # Перевіряємо наявність основних полів general_info
        important_fields = ['description', 'development_status', 'typical_units', 'developer']
        for field in important_fields:
            total_fields += 1
            if data.get(field) and len(str(data.get(field)).strip()) > 0:
                quality_score += 1
        
        return {
            "score": quality_score,
            "total_fields": total_fields,
            "percentage": round((quality_score / total_fields) * 100, 2) if total_fields > 0 else 0,
            "rating": "excellent" if quality_score >= total_fields * 0.8 else "good" if quality_score >= total_fields * 0.6 else "fair" if quality_score >= total_fields * 0.4 else "poor"
        }

    def parse_project_media(self, project_name, project_url=None):
        """
        Парсить медіа контент проекту (renders, pictures, videos)
        """
        try:
            print(f"📸 Парсинг Media для проекту: {project_name}")
            
            # Якщо URL не надано, шукаємо в базі проектів
            if not project_url:
                project_url = self._find_project_url(project_name)
                if not project_url:
                    print(f"❌ Не знайдено URL для проекту: {project_name}")
                    return False
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_media_page.png")
            
            # Витягуємо медіа контент
            media_data = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "renders": self._extract_renders(),
                "pictures": self._extract_pictures(),
                "videos": self._extract_videos(),
                "total_files": 0
            }
            
            # Підраховуємо загальну кількість файлів
            media_data["total_files"] = (
                len(media_data["renders"]) + 
                len(media_data["pictures"]) + 
                len(media_data["videos"])
            )
            
            # Зберігаємо медіа файли в папки
            self._save_media_files(project_name, media_data)
            
            # Зберігаємо метадані в JSON
            self._save_media_metadata(project_name, media_data)
            
            print(f"✅ Media збережено для проекту: {project_name}")
            print(f"📊 Знайдено файлів: {media_data['total_files']} (renders: {len(media_data['renders'])}, pictures: {len(media_data['pictures'])}, videos: {len(media_data['videos'])})")
            
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу Media для {project_name}: {str(e)}")
            return False

    def _extract_renders(self):
        """Витягує рендери проекту"""
        try:
            renders = []
            seen_urls = set()
            
            # Селектори для рендерів
            render_selectors = [
                "//img[contains(@src, 'render')]",
                "//img[contains(@src, '3d')]",
                "//img[contains(@src, 'visualization')]",
                "//img[contains(@class, 'render')]",
                "//img[contains(@alt, 'render')]",
                "//img[contains(@alt, '3d')]",
                "//img[contains(@alt, 'visualization')]",
                "//div[contains(@class, 'render')]//img",
                "//div[contains(@class, '3d')]//img",
                "//div[contains(@class, 'visualization')]//img"
            ]
            
            for selector in render_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        src = element.get_attribute("src")
                        alt = element.get_attribute("alt") or "render"
                        if src and src.startswith('http') and src not in seen_urls:
                            seen_urls.add(src)
                            renders.append({
                                "url": src,
                                "alt": alt,
                                "type": "render",
                                "filename": self._generate_filename(src, "render")
                            })
                except:
                    continue
            
            return renders
            
        except Exception as e:
            print(f"Помилка витягування рендерів: {str(e)}")
            return []

    def _extract_pictures(self):
        """Витягує зображення проекту"""
        try:
            pictures = []
            seen_urls = set()
            
            # Селектори для зображень
            picture_selectors = [
                "//img[contains(@src, 'photo')]",
                "//img[contains(@src, 'image')]",
                "//img[contains(@src, 'gallery')]",
                "//img[contains(@class, 'photo')]",
                "//img[contains(@class, 'image')]",
                "//img[contains(@class, 'gallery')]",
                "//img[contains(@alt, 'photo')]",
                "//img[contains(@alt, 'image')]",
                "//img[contains(@alt, 'gallery')]",
                "//div[contains(@class, 'gallery')]//img",
                "//div[contains(@class, 'photos')]//img",
                "//div[contains(@class, 'images')]//img",
                "//img[not(contains(@src, 'render')) and not(contains(@src, '3d')) and not(contains(@src, 'visualization'))]"
            ]
            
            for selector in picture_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        src = element.get_attribute("src")
                        alt = element.get_attribute("alt") or "picture"
                        if src and src.startswith('http') and src not in seen_urls and not any(keyword in src.lower() for keyword in ['render', '3d', 'visualization']):
                            seen_urls.add(src)
                            pictures.append({
                                "url": src,
                                "alt": alt,
                                "type": "picture",
                                "filename": self._generate_filename(src, "picture")
                            })
                except:
                    continue
            
            return pictures
            
        except Exception as e:
            print(f"Помилка витягування зображень: {str(e)}")
            return []

    def _extract_videos(self):
        """Витягує відео проекту"""
        try:
            videos = []
            seen_urls = set()
            
            # Селектори для відео
            video_selectors = [
                "//video",
                "//iframe[contains(@src, 'youtube')]",
                "//iframe[contains(@src, 'vimeo')]",
                "//iframe[contains(@src, 'video')]",
                "//video//source",
                "//div[contains(@class, 'video')]//video",
                "//div[contains(@class, 'video')]//iframe"
            ]
            
            for selector in video_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        src = element.get_attribute("src")
                        if not src:
                            src = element.get_attribute("data-src")
                        
                        if src and src not in seen_urls:
                            seen_urls.add(src)
                            videos.append({
                                "url": src,
                                "type": "video",
                                "platform": self._detect_video_platform(src),
                                "filename": self._generate_filename(src, "video")
                            })
                except:
                    continue
            
            return videos
            
        except Exception as e:
            print(f"Помилка витягування відео: {str(e)}")
            return []

    def _generate_filename(self, url, file_type):
        """Генерує назву файлу на основі URL"""
        try:
            # Створюємо унікальну назву на основі URL та часу
            import hashlib
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            timestamp = int(time.time() * 1000) % 1000000  # Мікросекунди
            
            # Отримуємо розширення файлу
            if file_type == "video":
                if "youtube" in url:
                    return f"video_{url_hash}_{timestamp}.mp4"
                elif "vimeo" in url:
                    return f"video_{url_hash}_{timestamp}.mp4"
                else:
                    return f"video_{url_hash}_{timestamp}.mp4"
            else:
                # Для зображень
                if "." in url.split("/")[-1]:
                    extension = url.split(".")[-1].split("?")[0]
                    if extension.lower() in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                        return f"{file_type}_{url_hash}_{timestamp}.{extension}"
                
                return f"{file_type}_{url_hash}_{timestamp}.jpg"
                
        except:
            return f"{file_type}_{int(time.time())}.jpg"

    def _detect_video_platform(self, url):
        """Визначає платформу відео"""
        if "youtube" in url:
            return "youtube"
        elif "vimeo" in url:
            return "vimeo"
        else:
            return "unknown"

    def _save_media_files(self, project_name, media_data):
        """Зберігає медіа файли в структуровані папки"""
        try:
            safe_name = self._sanitize_filename(project_name)
            project_path = os.path.join(self.projects_dir, safe_name)
            
            # Папки для медіа файлів
            media_folders = {
                "renders": os.path.join(project_path, "all_files", "media", "renders"),
                "pictures": os.path.join(project_path, "all_files", "media", "pictures"),
                "videos": os.path.join(project_path, "all_files", "media", "videos")
            }
            
            # Створюємо папки
            for folder in media_folders.values():
                os.makedirs(folder, exist_ok=True)
            
            # Зберігаємо файли
            for media_type, files in media_data.items():
                if media_type in ["renders", "pictures", "videos"]:
                    folder = media_folders[media_type]
                    for file_data in files:
                        self._download_media_file(file_data, folder)
            
            print(f"💾 Медіа файли збережено в папки для проекту: {project_name}")
            
        except Exception as e:
            print(f"Помилка збереження медіа файлів: {str(e)}")

    def _download_media_file(self, file_data, folder):
        """Завантажує медіа файл"""
        try:
            import requests
            
            url = file_data["url"]
            filename = file_data["filename"]
            filepath = os.path.join(folder, filename)
            
            # Перевіряємо, чи файл вже існує
            if os.path.exists(filepath):
                print(f"⚠️ Файл вже існує: {filename}")
                return
            
            # Завантажуємо файл
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"✅ Завантажено: {filename}")
            
        except Exception as e:
            print(f"❌ Помилка завантаження {file_data.get('filename', 'unknown')}: {str(e)}")

    def _save_media_metadata(self, project_name, media_data):
        """Зберігає метадані медіа в initial.json"""
        try:
            safe_name = self._sanitize_filename(project_name)
            project_path = os.path.join(self.projects_dir, safe_name)
            initial_path = os.path.join(project_path, "initial.json")
            
            # Завантажуємо поточний initial.json
            current_data = {}
            if os.path.exists(initial_path):
                with open(initial_path, 'r', encoding='utf-8') as f:
                    current_data = json.load(f)
            
            # Додаємо медіа дані
            current_data["media"] = media_data
            
            # Зберігаємо оновлений initial.json
            with open(initial_path, 'w', encoding='utf-8') as f:
                json.dump(current_data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Медіа дані додано до initial.json")
            
        except Exception as e:
            print(f"Помилка збереження медіа даних: {str(e)}")

    def _check_auth_on_project_page(self):
        """
        Перевіряє авторизацію на сторінці проекту і виконує додаткову авторизацію при необхідності
        """
        try:
            print("🔍 Перевіряємо авторизацію на сторінці проекту...")
            
            # Перевіряємо чи є повідомлення про необхідність авторизації
            try:
                auth_message = self.driver.find_element(By.XPATH, "//div[contains(@class, 'alert') and contains(text(), 'Only registered users')]")
                print("❌ Знайдено повідомлення про необхідність авторизації")
                
                # Шукаємо кнопку "GO TO AGENTS AREA"
                try:
                    agents_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'GO TO AGENTS AREA')]")
                    print("✅ Знайдено кнопку GO TO AGENTS AREA")
                    
                    # Клікаємо на кнопку
                    self.driver.execute_script("arguments[0].click();", agents_button)
                    time.sleep(3)
                    print("✅ Клікнуто на кнопку GO TO AGENTS AREA")
                    
                    # Шукаємо модальне вікно авторизації
                    try:
                        login_modal = self.driver.find_element(By.ID, "login_modal")
                        print("✅ Знайдено модальне вікно авторизації")
                        
                        # Заповнюємо форму авторизації
                        print("📝 Заповнюємо форму авторизації...")
                        
                        # Поле username
                        username_field = WebDriverWait(self.driver, 10).until(
                            EC.presence_of_element_located((By.ID, "login_usuario"))
                        )
                        username_field.clear()
                        username_field.send_keys(Config.LOGIN_EMAIL)
                        print("✅ Введено email")
                        
                        # Поле password
                        password_field = self.driver.find_element(By.ID, "login_contrasena")
                        password_field.clear()
                        password_field.send_keys(Config.LOGIN_PASSWORD)
                        print("✅ Введено password")
                        
                        # Кнопка LOGIN
                        login_button = self.driver.find_element(By.XPATH, "//input[@type='submit' and @value='LOGIN']")
                        self.driver.execute_script("arguments[0].click();", login_button)
                        print("✅ Клікнуто на кнопку LOGIN")
                        
                        # Чекаємо обробки форми
                        time.sleep(8)
                        
                        # Перевіряємо чи авторизація пройшла успішно
                        try:
                            agent_div = self.driver.find_element(By.XPATH, "//div[contains(@class, 'agent')]")
                            print("✅ Авторизація на сторінці проекту успішна!")
                            return True
                            
                        except:
                            print("❌ Авторизація на сторінці проекту не вдалася")
                            return False
                            
                    except:
                        print("❌ Модальне вікно авторизації не знайдено")
                        return False
                        
                except:
                    print("❌ Кнопка GO TO AGENTS AREA не знайдена")
                    return False
                    
            except:
                print("✅ Повідомлення про авторизацію не знайдено - авторизація успішна!")
                return True
            
        except Exception as e:
            print(f"❌ Помилка перевірки авторизації на сторінці проекту: {str(e)}")
            return False

    def parse_project_price_availability(self, project_name, project_url=None):
        """
        Парсить інформацію про ціни та доступність проекту
        """
        try:
            print(f"💰 Парсинг Price&Availability для проекту: {project_name}")
            
            # Якщо URL не надано, шукаємо в базі проектів
            if not project_url:
                project_url = self._find_project_url(project_name)
                if not project_url:
                    print(f"❌ Не знайдено URL для проекту: {project_name}")
                    return False
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_price_page.png")
            
            # Перевіряємо авторизацію на сторінці проекту і виконуємо додаткову авторизацію при необхідності
            if not self._check_auth_on_project_page():
                print(f"❌ Не вдалося авторизуватися на сторінці проекту: {project_name}")
                return False
            
            # Витягуємо інформацію про ціни та доступність
            price_availability_data = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "price_information": self._extract_price_information(),
                "responsive_table": self._extract_responsive_table(),
                "availability_information": self._extract_availability_information(),
                "contact_information": self._extract_contact_information(),
                "inquiry_options": self._extract_inquiry_options()
            }
            
            # Зберігаємо дані в JSON
            self._save_price_availability_metadata(project_name, price_availability_data)
            
            print(f"✅ Price&Availability збережено для проекту: {project_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу Price&Availability для {project_name}: {str(e)}")
            return False

    def _extract_price_information(self):
        """Витягує інформацію про ціни"""
        try:
            price_info = {
                "price_from": None,
                "price_to": None,
                "price_range": None,
                "currency": "EUR",
                "price_per_sqm": None,
                "payment_terms": None,
                "price_context": None,
                "price_selectors": []
            }
            
            # Селектори для цін
            price_selectors = [
                "//span[contains(@class, 'precio_ficha')]",
                "//div[contains(@class, 'cont_dorm_precio')]",
                "//div[contains(@class, 'precio_cont')]",
                "//span[contains(text(), '€')]",
                "//div[contains(text(), '€')]",
                "//*[contains(@class, 'price')]",
                "//*[contains(@class, 'cost')]",
                "//*[contains(@class, 'value')]"
            ]
            
            found_prices = []
            for selector in price_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and ('€' in text or 'EUR' in text or 'euro' in text.lower()):
                            found_prices.append({
                                'selector': selector,
                                'text': text,
                                'tag': element.tag_name,
                                'class': element.get_attribute('class')
                            })
                except:
                    continue
            
            if found_prices:
                # Беремо першу знайдену ціну як основну
                main_price = found_prices[0]
                price_info["price_from"] = main_price['text']
                price_info["price_selectors"] = [p['selector'] for p in found_prices]
                
                # Шукаємо контекст ціни (наприклад, "3 BEDS from 679.000€")
                for price in found_prices:
                    if 'from' in price['text'].lower() or 'beds' in price['text'].lower():
                        price_info["price_context"] = price['text']
                        break
                
                # Якщо контекст не знайдено, використовуємо основну ціну
                if not price_info["price_context"]:
                    price_info["price_context"] = main_price['text']
            
            return price_info
            
        except Exception as e:
            print(f"Помилка витягування цін: {str(e)}")
            return {}

    def _extract_responsive_table(self):
        """Витягує інформацію з responsive-table якщо вона є"""
        try:
            table_info = {
                "found": False,
                "table_id": "tabla_precios",
                "table_class": "responsive-table responsive-table--stack",
                "units_data": None,
                "headers": [],
                "rows": [],
                "floor_plans": []
            }
            
            # Вкладка Price & Availability вже активна після _check_auth_on_project_page
            print("🔍 Шукаємо таблицю з цінами...")
            
            # Очікуємо завантаження таблиці через AJAX
            print("⏳ Очікуємо завантаження таблиці через AJAX...")
            
            # Метод 1: Очікуємо завершення jQuery запитів
            try:
                print("Спроба 1: Очікуємо завершення jQuery запитів...")
                WebDriverWait(self.driver, 30).until(
                    lambda d: d.execute_script("return jQuery.active === 0")
                )
                print("✅ jQuery запити завершені")
            except:
                print("⚠️ jQuery запити не завершилися за 30 секунд")
            
            # Метод 2: Очікуємо появи таблиці з id="tabla_precios"
            try:
                print("Спроба 2: Очікуємо таблицю з id='tabla_precios'...")
                WebDriverWait(self.driver, 30).until(
                    EC.presence_of_element_located((By.ID, "tabla_precios"))
                )
                print("✅ Таблиця з id='tabla_precios' знайдена!")
            except:
                print("⚠️ Таблиця з id='tabla_precios' не з'явилася за 30 секунд")
            
            # Шукаємо таблицю з правильними селекторами
            table_selectors = [
                "//table[@id='tabla_precios']",
                "//table[contains(@class, 'responsive-table')]",
                "//table[contains(@class, 'responsive-table--stack')]",
                "//div[@id='precios']//table",
                "//div[contains(@class, 'tab-pane') and contains(@class, 'active')]//table",
                "//table",  # Загальний пошук всіх таблиць
                "//div[contains(@class, 'tab-content')]//table",
                "//div[contains(@class, 'container')]//table"
            ]
            
            for selector in table_selectors:
                try:
                    # Очікуємо появи таблиці
                    table_element = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    table_info["found"] = True
                    table_info["table_id"] = table_element.get_attribute('id') or "tabla_precios"
                    table_info["table_class"] = table_element.get_attribute('class') or "responsive-table responsive-table--stack"
                    
                    print(f"✅ Знайдено таблицю: {table_info['table_id']}")
                    
                    # Витягуємо заголовки з thead
                    thead = table_element.find_element(By.TAG_NAME, "thead")
                    header_row = thead.find_element(By.TAG_NAME, "tr")
                    headers = header_row.find_elements(By.TAG_NAME, "th")
                    table_info["headers"] = [header.text.strip() for header in headers if header.text.strip()]
                    
                    # Витягуємо рядки з даними з tbody
                    tbody = table_element.find_element(By.TAG_NAME, "tbody")
                    rows = tbody.find_elements(By.TAG_NAME, "tr")
                    
                    for row in rows:
                        # Отримуємо всі комірки (th для референсу + td для даних)
                        cells = row.find_elements(By.XPATH, ".//th | .//td")
                        if cells:
                            row_data = []
                            unit_ref = ""
                            
                            for i, cell in enumerate(cells):
                                cell_text = cell.text.strip()
                                if cell_text:
                                    row_data.append(cell_text)
                                    
                                    # Зберігаємо референс юніту (перша комірка)
                                    if i == 0:
                                        unit_ref = cell_text
                                
                                # Шукаємо посилання на плани в останній комірці
                                if i == len(cells) - 1:  # Остання комірка
                                    links = cell.find_elements(By.TAG_NAME, "a")
                                    for link in links:
                                        href = link.get_attribute('href')
                                        if href and 'documentacion' in href:
                                            table_info["floor_plans"].append({
                                                "unit_ref": unit_ref,
                                                "floor_plan_url": href
                                            })
                            
                            if row_data:
                                table_info["rows"].append(row_data)
                    
                    print(f"✅ Витягнуто {len(table_info['rows'])} рядків з даними")
                    print(f"✅ Знайдено {len(table_info['floor_plans'])} посилань на плани")
                    
                    break
                except Exception as e:
                    print(f"Помилка з селектором {selector}: {str(e)}")
                    continue
            
            return table_info
            
        except Exception as e:
            print(f"Помилка витягування responsive-table: {str(e)}")
            return {"found": False, "units_data": None}

    def _extract_availability_information(self):
        """Витягує інформацію про доступність"""
        try:
            availability_info = {
                "property_type": None,
                "bedrooms_range": None,
                "total_units": None,
                "available_units": None,
                "sold_units": None,
                "completion_date": None,
                "delivery_status": None
            }
            
            # Шукаємо тип нерухомості
            property_selectors = [
                "//*[contains(text(), 'apartment')]",
                "//*[contains(text(), 'penthouse')]",
                "//*[contains(text(), 'villa')]",
                "//*[contains(text(), 'house')]"
            ]
            
            for selector in property_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and len(text) > 10 and any(word in text.lower() for word in ['apartment', 'penthouse', 'villa', 'house']):
                            availability_info["property_type"] = text
                            break
                    if availability_info["property_type"]:
                        break
                except:
                    continue
            
            # Шукаємо кількість спалень
            bedroom_selectors = [
                "//*[contains(text(), 'bedroom')]",
                "//*[contains(text(), 'beds')]",
                "//*[contains(text(), 'dormitorio')]"
            ]
            
            for selector in bedroom_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and any(word in text.lower() for word in ['bedroom', 'beds', 'dormitorio']):
                            availability_info["bedrooms_range"] = text
                            break
                    if availability_info["bedrooms_range"]:
                        break
                except:
                    continue
            
            return availability_info
            
        except Exception as e:
            print(f"Помилка витягування доступності: {str(e)}")
            return {}

    def _extract_contact_information(self):
        """Витягує контактну інформацію"""
        try:
            contact_info = {
                "agent_name": None,
                "agent_email": None,
                "agent_phone": None,
                "contact_buttons": []
            }
            
            # Шукаємо email
            try:
                email_elements = self.driver.find_elements(By.XPATH, "//a[contains(@href, 'mailto:')]")
                for element in email_elements:
                    href = element.get_attribute('href')
                    if href and 'mailto:' in href:
                        contact_info["agent_email"] = href.replace('mailto:', '')
                        break
            except:
                pass
            
            # Шукаємо телефон
            try:
                phone_elements = self.driver.find_elements(By.XPATH, "//a[contains(@href, 'tel:')]")
                for element in phone_elements:
                    href = element.get_attribute('href')
                    if href and 'tel:' in href:
                        contact_info["agent_phone"] = href.replace('tel:', '')
                        break
            except:
                pass
            
            # Шукаємо ім'я агента
            try:
                name_elements = self.driver.find_elements(By.XPATH, "//*[contains(text(), 'Lucía') or contains(text(), 'Valle')]")
                for element in name_elements:
                    text = element.text.strip()
                    if text and ('Lucía' in text or 'Valle' in text):
                        contact_info["agent_name"] = text
                        break
            except:
                pass
            
            # Шукаємо кнопки контакту
            contact_button_selectors = [
                "//button[contains(text(), 'contact')]",
                "//a[contains(text(), 'contact')]",
                "//button[contains(text(), 'email')]",
                "//a[contains(text(), 'email')]"
            ]
            
            for selector in contact_button_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and text not in contact_info["contact_buttons"]:
                            contact_info["contact_buttons"].append(text)
                except:
                    continue
            
            return contact_info
            
        except Exception as e:
            print(f"Помилка витягування контактної інформації: {str(e)}")
            return {}

    def _extract_inquiry_options(self):
        """Витягує опції запитів"""
        try:
            inquiry_options = {
                "request_quote": True,
                "schedule_viewing": True,
                "download_brochure": None
            }
            
            # Шукаємо кнопку завантаження брошури
            try:
                brochure_elements = self.driver.find_elements(By.XPATH, "//*[contains(text(), 'brochure') or contains(text(), 'download')]")
                for element in brochure_elements:
                    text = element.text.strip().lower()
                    if 'brochure' in text or 'download' in text:
                        inquiry_options["download_brochure"] = element.text.strip()
                        break
            except:
                pass
            
            return inquiry_options
            
        except Exception as e:
            print(f"Помилка витягування опцій запитів: {str(e)}")
            return {}

    def _save_price_availability_metadata(self, project_name, price_availability_data):
        """Зберігає метадані Price&Availability в initial.json"""
        try:
            safe_name = self._sanitize_filename(project_name)
            project_path = os.path.join(self.projects_dir, safe_name)
            initial_path = os.path.join(project_path, "initial.json")
            
            # Завантажуємо поточний initial.json
            current_data = {}
            if os.path.exists(initial_path):
                with open(initial_path, 'r', encoding='utf-8') as f:
                    current_data = json.load(f)
            
            # Додаємо Price&Availability дані
            current_data["price_availability"] = price_availability_data
            
            # Зберігаємо оновлений initial.json
            with open(initial_path, 'w', encoding='utf-8') as f:
                json.dump(current_data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Price&Availability дані додано до initial.json")
            
        except Exception as e:
            print(f"Помилка збереження Price&Availability даних: {str(e)}")

    def parse_project_plans(self, project_name, project_url=None):
        """
        Парсить плани проекту
        """
        try:
            print(f"📋 Парсинг планів для проекту: {project_name}")
            
            # Якщо URL не надано, використовуємо правильний URL для MEDBLUE MARBELLA
            if not project_url:
                if project_name == "MEDBLUE MARBELLA":
                    project_url = "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93"
                else:
                    project_url = self._find_project_url(project_name)
                    if not project_url:
                        print(f"❌ Не знайдено URL для проекту: {project_name}")
                        return False
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_plans_page.png")
            
            # ПРИМУСОВА АВТОРИЗАЦІЯ для планів
            print("🔐 Виконуємо примусову авторизацію для планів...")
            
            # Клікаємо на вкладку PLANS
            print("🔍 Клікаємо на вкладку PLANS...")
            plans_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), 'PLANS')]")
            self.driver.execute_script("arguments[0].click();", plans_tab)
            time.sleep(3)
            print("✅ Клікнуто на вкладку PLANS")
            
            # Примусово шукаємо кнопку "GO TO AGENTS AREA"
            print("🔍 Шукаємо кнопку GO TO AGENTS AREA...")
            try:
                agents_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'GO TO AGENTS AREA')]")
                print("✅ Знайдено кнопку GO TO AGENTS AREA")
                
                # Клікаємо на кнопку
                self.driver.execute_script("arguments[0].click();", agents_button)
                time.sleep(3)
                print("✅ Клікнуто на кнопку GO TO AGENTS AREA")
                
                # Заповнюємо форму авторизації
                print("📝 Заповнюємо форму авторизації...")
                username_field = self.driver.find_element(By.XPATH, "//input[@id='login_usuario']")
                username_field.clear()
                username_field.send_keys(Config.LOGIN_EMAIL)
                print("✅ Введено email")
                
                password_field = self.driver.find_element(By.XPATH, "//input[@id='login_contrasena']")
                password_field.clear()
                password_field.send_keys(Config.LOGIN_PASSWORD)
                print("✅ Введено password")
                
                # Клікаємо на кнопку LOGIN
                login_button = self.driver.find_element(By.XPATH, "//input[@type='submit' and @value='LOGIN']")
                self.driver.execute_script("arguments[0].click();", login_button)
                print("✅ Клікнуто на кнопку LOGIN")
                time.sleep(8)
                
                # Повертаємося на сторінку проекту
                print("🔄 Повертаємося на сторінку проекту...")
                self.driver.get(project_url)
                time.sleep(5)
                
                # Клікаємо на вкладку PLANS знову
                plans_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), 'PLANS')]")
                self.driver.execute_script("arguments[0].click();", plans_tab)
                time.sleep(5)
                print("✅ Повторно клікнуто на вкладку PLANS після авторизації")
                
            except Exception as e:
                print(f"❌ Помилка примусової авторизації: {str(e)}")
                return False
            
            # Витягуємо інформацію про плани
            plans_data = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "plans_images": self._extract_plans_images(),
                "plans_documents": self._extract_plans_documents(),
                "plans_links": self._extract_plans_links(),
                "plans_containers": self._extract_plans_containers()
            }
            
            # Зберігаємо дані в JSON
            self._save_plans_metadata(project_name, plans_data)
            
            print(f"✅ Плани збережено для проекту: {project_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу планів для {project_name}: {str(e)}")
            return False

    def _extract_plans_images(self):
        """Витягує зображення планів"""
        try:
            plans_images = []
            
            # Шукаємо зображення в div з id="planos"
            try:
                planos_div = self.driver.find_element(By.ID, "planos")
                images_in_planos = planos_div.find_elements(By.TAG_NAME, "img")
                
                for i, img in enumerate(images_in_planos):
                    try:
                        src = img.get_attribute('src') or ''
                        alt = img.get_attribute('alt') or ''
                        title = img.get_attribute('title') or ''
                        
                        if src:
                            plans_images.append({
                                'index': i,
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'planos_div'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='planos' не знайдено")
            
            # Шукаємо зображення в контейнерах cont_img_plano
            try:
                plano_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_plano')]")
                for container in plano_containers:
                    try:
                        img = container.find_element(By.TAG_NAME, "img")
                        src = img.get_attribute('src') or ''
                        alt = img.get_attribute('alt') or ''
                        title = img.get_attribute('title') or ''
                        
                        if src:
                            plans_images.append({
                                'index': len(plans_images),
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'cont_img_plano'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_plano не знайдено")
            
            # Шукаємо зображення планів по всій сторінці
            all_images = self.driver.find_elements(By.TAG_NAME, "img")
            plans_keywords = ['plan', 'plano', 'plant', 'floor', 'piso', 'layout', 'diseño', 'design']
            
            for i, img in enumerate(all_images):
                try:
                    src = img.get_attribute('src') or ''
                    alt = img.get_attribute('alt') or ''
                    title = img.get_attribute('title') or ''
                    
                    # Перевіряємо чи це зображення плану
                    text_to_check = f"{alt} {title}".lower()
                    is_plan_image = False
                    
                    for keyword in plans_keywords:
                        if keyword in text_to_check or 'plan' in src.lower():
                            is_plan_image = True
                            break
                    
                    if is_plan_image and src:
                        # Перевіряємо чи це зображення ще не додано
                        already_exists = any(img_data['src'] == src for img_data in plans_images)
                        if not already_exists:
                            plans_images.append({
                                'index': i,
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'page_wide'
                            })
                            
                except:
                    continue
            
            print(f"✅ Знайдено {len(plans_images)} зображень планів")
            return plans_images
            
        except Exception as e:
            print(f"❌ Помилка витягування зображень планів: {str(e)}")
            return []

    def _extract_plans_documents(self):
        """Витягує документи планів (PDF тощо)"""
        try:
            plans_documents = []
            
            # Шукаємо PDF файли
            pdf_links = self.driver.find_elements(By.XPATH, "//a[contains(@href, '.pdf')]")
            
            for i, link in enumerate(pdf_links):
                try:
                    href = link.get_attribute('href')
                    text = link.text.strip()
                    
                    if href:
                        plans_documents.append({
                            'index': i,
                            'type': 'pdf',
                            'url': href,
                            'text': text,
                            'filename': href.split('/')[-1] if '/' in href else href
                        })
                except:
                    continue
            
            # Шукаємо інші документи
            doc_extensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
            for ext in doc_extensions:
                try:
                    doc_links = self.driver.find_elements(By.XPATH, f"//a[contains(@href, '{ext}')]")
                    
                    for i, link in enumerate(doc_links):
                        try:
                            href = link.get_attribute('href')
                            text = link.text.strip()
                            
                            if href:
                                plans_documents.append({
                                    'index': i,
                                    'type': ext[1:],  # Без крапки
                                    'url': href,
                                    'text': text,
                                    'filename': href.split('/')[-1] if '/' in href else href
                                })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(plans_documents)} документів планів")
            return plans_documents
            
        except Exception as e:
            print(f"❌ Помилка витягування документів планів: {str(e)}")
            return []

    def _extract_plans_links(self):
        """Витягує посилання планів"""
        try:
            plans_links = []
            plans_keywords = ['plan', 'plano', 'plant', 'floor', 'piso', 'layout', 'diseño', 'design']
            
            # Шукаємо посилання в div з id="planos"
            try:
                planos_div = self.driver.find_element(By.ID, "planos")
                links_in_planos = planos_div.find_elements(By.TAG_NAME, "a")
                
                for link in links_in_planos:
                    try:
                        href = link.get_attribute('href') or ''
                        text = link.text.strip()
                        
                        if href:
                            plans_links.append({
                                'text': text,
                                'href': href,
                                'location': 'planos_div'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='planos' не знайдено")
            
            # Шукаємо посилання в контейнерах cont_img_plano
            try:
                plano_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_plano')]")
                for container in plano_containers:
                    try:
                        link = container.find_element(By.TAG_NAME, "a")
                        href = link.get_attribute('href') or ''
                        text = link.text.strip()
                        
                        if href:
                            plans_links.append({
                                'text': text,
                                'href': href,
                                'location': 'cont_img_plano'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_plano не знайдено")
            
            for keyword in plans_keywords:
                try:
                    links = self.driver.find_elements(By.XPATH, f"//a[contains(text(), '{keyword}') or contains(@href, '{keyword}')]")
                    
                    for link in links:
                        try:
                            href = link.get_attribute('href')
                            text = link.text.strip()
                            
                            if href and text:
                                # Перевіряємо чи це посилання ще не додано
                                already_exists = any(link_data['href'] == href for link_data in plans_links)
                                if not already_exists:
                                    plans_links.append({
                                        'text': text,
                                        'href': href,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(plans_links)} посилань планів")
            return plans_links
            
        except Exception as e:
            print(f"❌ Помилка витягування посилань планів: {str(e)}")
            return []

    def _extract_plans_containers(self):
        """Витягує контейнери з планами"""
        try:
            plans_containers = []
            plans_keywords = ['plan', 'plano', 'plant', 'floor', 'piso', 'layout', 'diseño', 'design']
            
            for keyword in plans_keywords:
                try:
                    divs = self.driver.find_elements(By.XPATH, f"//div[contains(@class, '{keyword}') or contains(@id, '{keyword}')]")
                    
                    for div in divs:
                        try:
                            div_id = div.get_attribute('id') or ''
                            div_class = div.get_attribute('class') or ''
                            div_text = div.text.strip()[:200] if div.text else ''
                            
                            if div_id or div_class:
                                # Перевіряємо чи це контейнер ще не додано
                                already_exists = any(container['id'] == div_id and container['class'] == div_class for container in plans_containers)
                                if not already_exists:
                                    plans_containers.append({
                                        'id': div_id,
                                        'class': div_class,
                                        'text': div_text,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(plans_containers)} контейнерів планів")
            return plans_containers
            
        except Exception as e:
            print(f"❌ Помилка витягування контейнерів планів: {str(e)}")
            return []

    def _save_plans_metadata(self, project_name, plans_data):
        """Зберігає метадані планів в initial.json"""
        try:
            # Створюємо папку для проекту, якщо її немає
            project_dir = os.path.join(self.projects_dir, project_name.replace(' ', '_'))
            if not os.path.exists(project_dir):
                os.makedirs(project_dir)
            
            # Шлях до initial.json
            initial_json_path = os.path.join(project_dir, "initial.json")
            
            # Завантажуємо існуючі дані або створюємо нові
            if os.path.exists(initial_json_path):
                with open(initial_json_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            else:
                existing_data = {
                    "project_metadata": {
                        "name": project_name,
                        "parsed_at": datetime.now().isoformat()
                    }
                }
            
            # Додаємо дані планів
            existing_data["plans"] = plans_data
            
            # Зберігаємо оновлені дані
            with open(initial_json_path, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
            print(f"💾 Дані планів додано до initial.json")
            
        except Exception as e:
            print(f"❌ Помилка збереження даних планів: {str(e)}")

    def parse_project_quality_specs(self, project_name, project_url=None):
        """
        Парсить quality specifications проекту
        """
        try:
            print(f"📋 Парсинг quality specifications для проекту: {project_name}")
            
            # Якщо URL не надано, використовуємо правильний URL для MEDBLUE MARBELLA
            if not project_url:
                if project_name == "MEDBLUE MARBELLA":
                    project_url = "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93"
                else:
                    project_url = self._find_project_url(project_name)
                    if not project_url:
                        print(f"❌ Не знайдено URL для проекту: {project_name}")
                        return False
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_quality_specs_page.png")
            
            # ПРИМУСОВА АВТОРИЗАЦІЯ для quality specifications
            print("🔐 Виконуємо примусову авторизацію для quality specifications...")
            
            # Клікаємо на вкладку QUALITY SPECIFICATIONS
            print("🔍 Клікаємо на вкладку QUALITY SPECIFICATIONS...")
            try:
                quality_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), 'QUALITY SPECIFICATIONS')]")
                self.driver.execute_script("arguments[0].click();", quality_tab)
                time.sleep(3)
                print("✅ Клікнуто на вкладку QUALITY SPECIFICATIONS")
            except Exception as e:
                print(f"❌ Не вдалося знайти вкладку QUALITY SPECIFICATIONS: {str(e)}")
                return False
            
            # Примусово шукаємо кнопку "GO TO AGENTS AREA"
            print("🔍 Шукаємо кнопку GO TO AGENTS AREA...")
            try:
                agents_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'GO TO AGENTS AREA')]")
                print("✅ Знайдено кнопку GO TO AGENTS AREA")
                
                # Клікаємо на кнопку
                self.driver.execute_script("arguments[0].click();", agents_button)
                time.sleep(3)
                print("✅ Клікнуто на кнопку GO TO AGENTS AREA")
                
                # Заповнюємо форму авторизації
                print("📝 Заповнюємо форму авторизації...")
                username_field = self.driver.find_element(By.XPATH, "//input[@id='login_usuario']")
                username_field.clear()
                username_field.send_keys(Config.LOGIN_EMAIL)
                print("✅ Введено email")
                
                password_field = self.driver.find_element(By.XPATH, "//input[@id='login_contrasena']")
                password_field.clear()
                password_field.send_keys(Config.LOGIN_PASSWORD)
                print("✅ Введено password")
                
                # Клікаємо на кнопку LOGIN
                login_button = self.driver.find_element(By.XPATH, "//input[@type='submit' and @value='LOGIN']")
                self.driver.execute_script("arguments[0].click();", login_button)
                print("✅ Клікнуто на кнопку LOGIN")
                time.sleep(8)
                
                # Повертаємося на сторінку проекту
                print("🔄 Повертаємося на сторінку проекту...")
                self.driver.get(project_url)
                time.sleep(5)
                
                # Клікаємо на вкладку QUALITY SPECIFICATIONS знову
                quality_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), 'QUALITY SPECIFICATIONS')]")
                self.driver.execute_script("arguments[0].click();", quality_tab)
                time.sleep(5)
                print("✅ Повторно клікнуто на вкладку QUALITY SPECIFICATIONS після авторизації")
                
            except Exception as e:
                print(f"❌ Помилка примусової авторизації: {str(e)}")
                return False
            
            # Витягуємо інформацію про quality specifications
            quality_specs_data = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "quality_specs_images": self._extract_quality_specs_images(),
                "quality_specs_documents": self._extract_quality_specs_documents(),
                "quality_specs_links": self._extract_quality_specs_links(),
                "quality_specs_containers": self._extract_quality_specs_containers(),
                "quality_specs_text": self._extract_quality_specs_text()
            }
            
            # Зберігаємо дані в JSON
            self._save_quality_specs_metadata(project_name, quality_specs_data)
            
            print(f"✅ Quality specifications збережено для проекту: {project_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу quality specifications для {project_name}: {str(e)}")
            return False

    def _save_quality_specs_metadata(self, project_name, quality_specs_data):
        """Зберігає метадані quality specifications в initial.json"""
        try:
            # Створюємо папку для проекту, якщо її немає
            project_dir = os.path.join(self.projects_dir, project_name.replace(' ', '_'))
            if not os.path.exists(project_dir):
                os.makedirs(project_dir)
            
            # Шлях до initial.json
            initial_json_path = os.path.join(project_dir, "initial.json")
            
            # Завантажуємо існуючі дані або створюємо нові
            if os.path.exists(initial_json_path):
                with open(initial_json_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            else:
                existing_data = {
                    "project_metadata": {
                        "name": project_name,
                        "parsed_at": datetime.now().isoformat()
                    }
                }
            
            # Додаємо дані quality specifications
            existing_data["quality_specifications"] = quality_specs_data
            
            # Зберігаємо оновлені дані
            with open(initial_json_path, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
            print("💾 Дані quality specifications додано до initial.json")
            
        except Exception as e:
            print(f"❌ Помилка збереження даних quality specifications: {str(e)}")

    def _extract_quality_specs_images(self):
        """Витягує зображення quality specifications"""
        try:
            quality_specs_images = []
            
            # Шукаємо зображення в div з id="calidades"
            try:
                calidades_div = self.driver.find_element(By.ID, "calidades")
                images_in_calidades = calidades_div.find_elements(By.TAG_NAME, "img")
                
                for i, img in enumerate(images_in_calidades):
                    try:
                        src = img.get_attribute('src') or ''
                        alt = img.get_attribute('alt') or ''
                        title = img.get_attribute('title') or ''
                        
                        if src:
                            quality_specs_images.append({
                                'index': i,
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'calidades_div'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='calidades' не знайдено")
            
            # Шукаємо зображення в контейнерах cont_img_calidades
            try:
                calidades_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_calidades')]")
                for container in calidades_containers:
                    try:
                        img = container.find_element(By.TAG_NAME, "img")
                        src = img.get_attribute('src') or ''
                        alt = img.get_attribute('alt') or ''
                        title = img.get_attribute('title') or ''
                        
                        if src:
                            quality_specs_images.append({
                                'index': len(quality_specs_images),
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'cont_img_calidades'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_calidades не знайдено")
            
            # Шукаємо зображення quality specifications по всій сторінці
            all_images = self.driver.find_elements(By.TAG_NAME, "img")
            quality_keywords = ['quality', 'calidad', 'specification', 'especificacion', 'material', 'acabado', 'finish']
            
            for i, img in enumerate(all_images):
                try:
                    src = img.get_attribute('src') or ''
                    alt = img.get_attribute('alt') or ''
                    title = img.get_attribute('title') or ''
                    
                    # Перевіряємо чи це зображення quality specifications
                    text_to_check = f"{alt} {title}".lower()
                    is_quality_image = False
                    
                    for keyword in quality_keywords:
                        if keyword in text_to_check or 'quality' in src.lower():
                            is_quality_image = True
                            break
                    
                    if is_quality_image and src:
                        # Перевіряємо чи це зображення ще не додано
                        already_exists = any(img_data['src'] == src for img_data in quality_specs_images)
                        if not already_exists:
                            quality_specs_images.append({
                                'index': i,
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'page_wide'
                            })
                            
                except:
                    continue
            
            print(f"✅ Знайдено {len(quality_specs_images)} зображень quality specifications")
            return quality_specs_images
            
        except Exception as e:
            print(f"❌ Помилка витягування зображень quality specifications: {str(e)}")
            return []

    def _extract_quality_specs_documents(self):
        """Витягує документи quality specifications"""
        try:
            quality_specs_documents = []
            
            # Шукаємо embed PDF документи в div з id="calidades"
            try:
                calidades_div = self.driver.find_element(By.ID, "calidades")
                embed_documents = calidades_div.find_elements(By.XPATH, ".//embed[@type='application/pdf']")
                
                for i, embed in enumerate(embed_documents):
                    try:
                        src = embed.get_attribute('src') or ''
                        width = embed.get_attribute('width') or ''
                        height = embed.get_attribute('height') or ''
                        
                        # Шукаємо текст поруч з embed елементом
                        parent_container = embed.find_element(By.XPATH, "./..")
                        text_elements = parent_container.find_elements(By.XPATH, ".//p")
                        text = text_elements[0].text.strip() if text_elements else "PDF Document"
                        
                        if src:
                            quality_specs_documents.append({
                                'index': i,
                                'src': src,
                                'text': text,
                                'file_type': 'PDF',
                                'width': width,
                                'height': height,
                                'location': 'calidades_div',
                                'type': 'embed'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='calidades' не знайдено")
            
            # Шукаємо embed PDF документи в контейнерах cont_img_calidades
            try:
                calidades_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_calidades')]")
                for container in calidades_containers:
                    try:
                        embed = container.find_element(By.XPATH, ".//embed[@type='application/pdf']")
                        src = embed.get_attribute('src') or ''
                        width = embed.get_attribute('width') or ''
                        height = embed.get_attribute('height') or ''
                        
                        # Шукаємо текст поруч з embed елементом
                        text_elements = container.find_elements(By.XPATH, ".//p")
                        text = text_elements[0].text.strip() if text_elements else "PDF Document"
                        
                        if src:
                            quality_specs_documents.append({
                                'index': len(quality_specs_documents),
                                'src': src,
                                'text': text,
                                'file_type': 'PDF',
                                'width': width,
                                'height': height,
                                'location': 'cont_img_calidades',
                                'type': 'embed'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_calidades не знайдено")
            
            # Шукаємо звичайні посилання на документи
            try:
                calidades_div = self.driver.find_element(By.ID, "calidades")
                link_documents = calidades_div.find_elements(By.XPATH, ".//a[contains(@href, '.pdf') or contains(@href, '.doc') or contains(@href, '.xls')]")
                
                for doc in link_documents:
                    try:
                        href = doc.get_attribute('href') or ''
                        text = doc.text.strip()
                        file_type = href.split('.')[-1].upper() if '.' in href else 'UNKNOWN'
                        
                        if href:
                            # Перевіряємо чи це документ ще не додано
                            already_exists = any(doc_data.get('href') == href for doc_data in quality_specs_documents)
                            if not already_exists:
                                quality_specs_documents.append({
                                    'index': len(quality_specs_documents),
                                    'href': href,
                                    'text': text,
                                    'file_type': file_type,
                                    'location': 'calidades_div',
                                    'type': 'link'
                                })
                    except:
                        continue
                        
            except:
                print("Посилання на документи не знайдено")
            
            print(f"✅ Знайдено {len(quality_specs_documents)} документів quality specifications")
            return quality_specs_documents
            
        except Exception as e:
            print(f"❌ Помилка витягування документів quality specifications: {str(e)}")
            return []

    def _extract_quality_specs_links(self):
        """Витягує посилання quality specifications"""
        try:
            quality_specs_links = []
            quality_keywords = ['quality', 'calidad', 'specification', 'especificacion', 'material', 'acabado', 'finish']
            
            # Шукаємо посилання в div з id="calidades"
            try:
                calidades_div = self.driver.find_element(By.ID, "calidades")
                links_in_calidades = calidades_div.find_elements(By.TAG_NAME, "a")
                
                for link in links_in_calidades:
                    try:
                        href = link.get_attribute('href') or ''
                        text = link.text.strip()
                        
                        if href:
                            quality_specs_links.append({
                                'text': text,
                                'href': href,
                                'location': 'calidades_div'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='calidades' не знайдено")
            
            # Шукаємо посилання в контейнерах cont_img_calidades
            try:
                calidades_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_calidades')]")
                for container in calidades_containers:
                    try:
                        link = container.find_element(By.TAG_NAME, "a")
                        href = link.get_attribute('href') or ''
                        text = link.text.strip()
                        
                        if href:
                            quality_specs_links.append({
                                'text': text,
                                'href': href,
                                'location': 'cont_img_calidades'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_calidades не знайдено")
            
            for keyword in quality_keywords:
                try:
                    links = self.driver.find_elements(By.XPATH, f"//a[contains(text(), '{keyword}') or contains(@href, '{keyword}')]")
                    
                    for link in links:
                        try:
                            href = link.get_attribute('href')
                            text = link.text.strip()
                            
                            if href and text:
                                # Перевіряємо чи це посилання ще не додано
                                already_exists = any(link_data['href'] == href for link_data in quality_specs_links)
                                if not already_exists:
                                    quality_specs_links.append({
                                        'text': text,
                                        'href': href,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(quality_specs_links)} посилань quality specifications")
            return quality_specs_links
            
        except Exception as e:
            print(f"❌ Помилка витягування посилань quality specifications: {str(e)}")
            return []

    def _extract_quality_specs_containers(self):
        """Витягує контейнери quality specifications"""
        try:
            quality_specs_containers = []
            quality_keywords = ['quality', 'calidad', 'specification', 'especificacion', 'material', 'acabado', 'finish']
            
            for keyword in quality_keywords:
                try:
                    divs = self.driver.find_elements(By.XPATH, f"//div[contains(@class, '{keyword}') or contains(@id, '{keyword}')]")
                    
                    for div in divs:
                        try:
                            div_id = div.get_attribute('id') or ''
                            div_class = div.get_attribute('class') or ''
                            div_text = div.text.strip()[:200] if div.text else ''
                            
                            if div_id or div_class:
                                # Перевіряємо чи це контейнер ще не додано
                                already_exists = any(container['id'] == div_id and container['class'] == div_class for container in quality_specs_containers)
                                if not already_exists:
                                    quality_specs_containers.append({
                                        'id': div_id,
                                        'class': div_class,
                                        'text': div_text,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(quality_specs_containers)} контейнерів quality specifications")
            return quality_specs_containers
            
        except Exception as e:
            print(f"❌ Помилка витягування контейнерів quality specifications: {str(e)}")
            return []

    def _extract_quality_specs_text(self):
        """Витягує текст quality specifications"""
        try:
            quality_specs_text = ""
            
            # Шукаємо текст в div з id="calidades"
            try:
                calidades_div = self.driver.find_element(By.ID, "calidades")
                quality_specs_text = calidades_div.text.strip()
            except:
                print("div з id='calidades' не знайдено")
            
            # Якщо текст не знайдено, шукаємо в інших місцях
            if not quality_specs_text:
                try:
                    # Шукаємо в контейнерах з quality specifications
                    quality_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'calidad') or contains(@class, 'quality')]")
                    for container in quality_containers:
                        container_text = container.text.strip()
                        if container_text:
                            quality_specs_text += container_text + "\n"
                except:
                    pass
            
            print(f"✅ Витягнуто текст quality specifications: {len(quality_specs_text)} символів")
            return quality_specs_text
            
        except Exception as e:
            print(f"❌ Помилка витягування тексту quality specifications: {str(e)}")
            return ""

    def parse_project_brochure(self, project_name, project_url=None):
        """
        Парсить brochure проекту (тільки англійська версія)
        """
        try:
            print(f"📋 Парсинг brochure для проекту: {project_name}")
            
            # Якщо URL не надано, використовуємо правильний URL для MEDBLUE MARBELLA
            if not project_url:
                if project_name == "MEDBLUE MARBELLA":
                    project_url = "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93"
                else:
                    project_url = self._find_project_url(project_name)
                    if not project_url:
                        print(f"❌ Не знайдено URL для проекту: {project_name}")
                        return False
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_brochure_page.png")
            
            # ПРИМУСОВА АВТОРИЗАЦІЯ для brochure
            print("🔐 Виконуємо примусову авторизацію для brochure...")
            
            # Клікаємо на вкладку BROCHURE
            print("🔍 Клікаємо на вкладку BROCHURE...")
            try:
                brochure_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), 'BROCHURE')]")
                self.driver.execute_script("arguments[0].click();", brochure_tab)
                time.sleep(3)
                print("✅ Клікнуто на вкладку BROCHURE")
            except Exception as e:
                print(f"❌ Не вдалося знайти вкладку BROCHURE: {str(e)}")
                return False
            
            # Примусово шукаємо кнопку "GO TO AGENTS AREA"
            print("🔍 Шукаємо кнопку GO TO AGENTS AREA...")
            try:
                agents_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'GO TO AGENTS AREA')]")
                print("✅ Знайдено кнопку GO TO AGENTS AREA")
                
                # Клікаємо на кнопку
                self.driver.execute_script("arguments[0].click();", agents_button)
                time.sleep(3)
                print("✅ Клікнуто на кнопку GO TO AGENTS AREA")
                
                # Заповнюємо форму авторизації
                print("📝 Заповнюємо форму авторизації...")
                username_field = self.driver.find_element(By.XPATH, "//input[@id='login_usuario']")
                username_field.clear()
                username_field.send_keys(Config.LOGIN_EMAIL)
                print("✅ Введено email")
                
                password_field = self.driver.find_element(By.XPATH, "//input[@id='login_contrasena']")
                password_field.clear()
                password_field.send_keys(Config.LOGIN_PASSWORD)
                print("✅ Введено password")
                
                # Клікаємо на кнопку LOGIN
                login_button = self.driver.find_element(By.XPATH, "//input[@type='submit' and @value='LOGIN']")
                self.driver.execute_script("arguments[0].click();", login_button)
                print("✅ Клікнуто на кнопку LOGIN")
                time.sleep(8)
                
                # Повертаємося на сторінку проекту
                print("🔄 Повертаємося на сторінку проекту...")
                self.driver.get(project_url)
                time.sleep(5)
                
                # Клікаємо на вкладку BROCHURE знову
                brochure_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), 'BROCHURE')]")
                self.driver.execute_script("arguments[0].click();", brochure_tab)
                time.sleep(5)
                print("✅ Повторно клікнуто на вкладку BROCHURE після авторизації")
                
            except Exception as e:
                print(f"❌ Помилка примусової авторизації: {str(e)}")
                return False
            
            # Витягуємо інформацію про brochure
            brochure_data = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "brochure_images": self._extract_brochure_images(),
                "brochure_documents": self._extract_brochure_documents(),
                "brochure_links": self._extract_brochure_links(),
                "brochure_containers": self._extract_brochure_containers(),
                "brochure_text": self._extract_brochure_text()
            }
            
            # Зберігаємо дані в JSON
            self._save_brochure_metadata(project_name, brochure_data)
            
            print(f"✅ Brochure збережено для проекту: {project_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу brochure для {project_name}: {str(e)}")
            return False

    def _save_brochure_metadata(self, project_name, brochure_data):
        """Зберігає метадані brochure в initial.json"""
        try:
            # Створюємо папку для проекту, якщо її немає
            project_dir = os.path.join(self.projects_dir, project_name.replace(' ', '_'))
            if not os.path.exists(project_dir):
                os.makedirs(project_dir)
            
            # Шлях до initial.json
            initial_json_path = os.path.join(project_dir, "initial.json")
            
            # Завантажуємо існуючі дані або створюємо нові
            if os.path.exists(initial_json_path):
                with open(initial_json_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            else:
                existing_data = {
                    "project_metadata": {
                        "name": project_name,
                        "parsed_at": datetime.now().isoformat()
                    }
                }
            
            # Додаємо дані brochure
            existing_data["brochure"] = brochure_data
            
            # Зберігаємо оновлені дані
            with open(initial_json_path, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
            print("💾 Дані brochure додано до initial.json")
            
        except Exception as e:
            print(f"❌ Помилка збереження даних brochure: {str(e)}")

    def _extract_brochure_images(self):
        """Витягує зображення brochure"""
        try:
            brochure_images = []
            
            # Шукаємо зображення в div з id="folleto"
            try:
                brochure_div = self.driver.find_element(By.ID, "folleto")
                images_in_brochure = brochure_div.find_elements(By.TAG_NAME, "img")
                
                for i, img in enumerate(images_in_brochure):
                    try:
                        src = img.get_attribute('src') or ''
                        alt = img.get_attribute('alt') or ''
                        title = img.get_attribute('title') or ''
                        
                        if src:
                            brochure_images.append({
                                'index': i,
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'brochure_div'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='folleto' не знайдено")
            
            # Шукаємо зображення в контейнерах cont_img_brochure
            try:
                brochure_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_brochure')]")
                for container in brochure_containers:
                    try:
                        img = container.find_element(By.TAG_NAME, "img")
                        src = img.get_attribute('src') or ''
                        alt = img.get_attribute('alt') or ''
                        title = img.get_attribute('title') or ''
                        
                        if src:
                            brochure_images.append({
                                'index': len(brochure_images),
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'cont_img_brochure'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_brochure не знайдено")
            
            # Шукаємо зображення brochure по всій сторінці
            all_images = self.driver.find_elements(By.TAG_NAME, "img")
            brochure_keywords = ['brochure', 'folleto', 'catalog', 'catalogo']
            
            for i, img in enumerate(all_images):
                try:
                    src = img.get_attribute('src') or ''
                    alt = img.get_attribute('alt') or ''
                    title = img.get_attribute('title') or ''
                    
                    # Перевіряємо чи це зображення brochure
                    text_to_check = f"{alt} {title}".lower()
                    is_brochure_image = False
                    
                    for keyword in brochure_keywords:
                        if keyword in text_to_check or 'brochure' in src.lower():
                            is_brochure_image = True
                            break
                    
                    if is_brochure_image and src:
                        # Перевіряємо чи це зображення ще не додано
                        already_exists = any(img_data['src'] == src for img_data in brochure_images)
                        if not already_exists:
                            brochure_images.append({
                                'index': i,
                                'src': src,
                                'alt': alt,
                                'title': title,
                                'location': 'page_wide'
                            })
                            
                except:
                    continue
            
            print(f"✅ Знайдено {len(brochure_images)} зображень brochure")
            return brochure_images
            
        except Exception as e:
            print(f"❌ Помилка витягування зображень brochure: {str(e)}")
            return []

    def _extract_brochure_documents(self):
        """Витягує документи brochure"""
        try:
            brochure_documents = []
            
            # Шукаємо embed PDF документи в div з id="folleto"
            try:
                brochure_div = self.driver.find_element(By.ID, "folleto")
                embed_documents = brochure_div.find_elements(By.XPATH, ".//embed[@type='application/pdf']")
                
                for i, embed in enumerate(embed_documents):
                    try:
                        src = embed.get_attribute('src') or ''
                        width = embed.get_attribute('width') or ''
                        height = embed.get_attribute('height') or ''
                        
                        # Шукаємо текст поруч з embed елементом
                        parent_container = embed.find_element(By.XPATH, "./..")
                        text_elements = parent_container.find_elements(By.XPATH, ".//p")
                        text = text_elements[0].text.strip() if text_elements else "Brochure PDF"
                        
                        if src:
                            brochure_documents.append({
                                'index': i,
                                'src': src,
                                'text': text,
                                'file_type': 'PDF',
                                'width': width,
                                'height': height,
                                'location': 'brochure_div',
                                'type': 'embed'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='folleto' не знайдено")
            
            # Шукаємо embed PDF документи в контейнерах cont_img_brochure
            try:
                brochure_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_brochure')]")
                for container in brochure_containers:
                    try:
                        embed = container.find_element(By.XPATH, ".//embed[@type='application/pdf']")
                        src = embed.get_attribute('src') or ''
                        width = embed.get_attribute('width') or ''
                        height = embed.get_attribute('height') or ''
                        
                        # Шукаємо текст поруч з embed елементом
                        text_elements = container.find_elements(By.XPATH, ".//p")
                        text = text_elements[0].text.strip() if text_elements else "Brochure PDF"
                        
                        if src:
                            brochure_documents.append({
                                'index': len(brochure_documents),
                                'src': src,
                                'text': text,
                                'file_type': 'PDF',
                                'width': width,
                                'height': height,
                                'location': 'cont_img_brochure',
                                'type': 'embed'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_brochure не знайдено")
            
            # Шукаємо звичайні посилання на документи
            try:
                brochure_div = self.driver.find_element(By.ID, "folleto")
                link_documents = brochure_div.find_elements(By.XPATH, ".//a[contains(@href, '.pdf') or contains(@href, '.doc') or contains(@href, '.xls')]")
                
                for doc in link_documents:
                    try:
                        href = doc.get_attribute('href') or ''
                        text = doc.text.strip()
                        file_type = href.split('.')[-1].upper() if '.' in href else 'UNKNOWN'
                        
                        if href:
                            # Перевіряємо чи це документ ще не додано
                            already_exists = any(doc_data.get('href') == href for doc_data in brochure_documents)
                            if not already_exists:
                                brochure_documents.append({
                                    'index': len(brochure_documents),
                                    'href': href,
                                    'text': text,
                                    'file_type': file_type,
                                    'location': 'brochure_div',
                                    'type': 'link'
                                })
                    except:
                        continue
                        
            except:
                print("Посилання на документи не знайдено")
            
            print(f"✅ Знайдено {len(brochure_documents)} документів brochure")
            return brochure_documents
            
        except Exception as e:
            print(f"❌ Помилка витягування документів brochure: {str(e)}")
            return []

    def _extract_brochure_links(self):
        """Витягує посилання brochure"""
        try:
            brochure_links = []
            brochure_keywords = ['brochure', 'folleto', 'catalog', 'catalogo']
            
            # Шукаємо посилання в div з id="folleto"
            try:
                brochure_div = self.driver.find_element(By.ID, "folleto")
                links_in_brochure = brochure_div.find_elements(By.TAG_NAME, "a")
                
                for link in links_in_brochure:
                    try:
                        href = link.get_attribute('href') or ''
                        text = link.text.strip()
                        
                        if href:
                            brochure_links.append({
                                'text': text,
                                'href': href,
                                'location': 'brochure_div'
                            })
                    except:
                        continue
                        
            except:
                print("div з id='folleto' не знайдено")
            
            # Шукаємо посилання в контейнерах cont_img_brochure
            try:
                brochure_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cont_img_brochure')]")
                for container in brochure_containers:
                    try:
                        link = container.find_element(By.TAG_NAME, "a")
                        href = link.get_attribute('href') or ''
                        text = link.text.strip()
                        
                        if href:
                            brochure_links.append({
                                'text': text,
                                'href': href,
                                'location': 'cont_img_brochure'
                            })
                    except:
                        continue
            except:
                print("Контейнери cont_img_brochure не знайдено")
            
            for keyword in brochure_keywords:
                try:
                    links = self.driver.find_elements(By.XPATH, f"//a[contains(text(), '{keyword}') or contains(@href, '{keyword}')]")
                    
                    for link in links:
                        try:
                            href = link.get_attribute('href')
                            text = link.text.strip()
                            
                            if href and text:
                                # Перевіряємо чи це посилання ще не додано
                                already_exists = any(link_data['href'] == href for link_data in brochure_links)
                                if not already_exists:
                                    brochure_links.append({
                                        'text': text,
                                        'href': href,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(brochure_links)} посилань brochure")
            return brochure_links
            
        except Exception as e:
            print(f"❌ Помилка витягування посилань brochure: {str(e)}")
            return []

    def _extract_brochure_containers(self):
        """Витягує контейнери brochure"""
        try:
            brochure_containers = []
            brochure_keywords = ['brochure', 'folleto', 'catalog', 'catalogo']
            
            for keyword in brochure_keywords:
                try:
                    divs = self.driver.find_elements(By.XPATH, f"//div[contains(@class, '{keyword}') or contains(@id, '{keyword}')]")
                    
                    for div in divs:
                        try:
                            div_id = div.get_attribute('id') or ''
                            div_class = div.get_attribute('class') or ''
                            div_text = div.text.strip()[:200] if div.text else ''
                            
                            if div_id or div_class:
                                # Перевіряємо чи це контейнер ще не додано
                                already_exists = any(container['id'] == div_id and container['class'] == div_class for container in brochure_containers)
                                if not already_exists:
                                    brochure_containers.append({
                                        'id': div_id,
                                        'class': div_class,
                                        'text': div_text,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(brochure_containers)} контейнерів brochure")
            return brochure_containers
            
        except Exception as e:
            print(f"❌ Помилка витягування контейнерів brochure: {str(e)}")
            return []

    def _extract_brochure_text(self):
        """Витягує текст brochure"""
        try:
            brochure_text = ""
            
            # Шукаємо текст в div з id="folleto"
            try:
                brochure_div = self.driver.find_element(By.ID, "folleto")
                brochure_text = brochure_div.text.strip()
            except:
                print("div з id='folleto' не знайдено")
            
            # Якщо текст не знайдено, шукаємо в інших місцях
            if not brochure_text:
                try:
                    # Шукаємо в контейнерах з brochure
                    brochure_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'brochure') or contains(@class, 'folleto')]")
                    for container in brochure_containers:
                        container_text = container.text.strip()
                        if container_text:
                            brochure_text += container_text + "\n"
                except:
                    pass
            
            print(f"✅ Витягнуто текст brochure: {len(brochure_text)} символів")
            return brochure_text
            
        except Exception as e:
            print(f"❌ Помилка витягування тексту brochure: {str(e)}")
            return ""

    def parse_project_location(self, project_name, project_url=None):
        """
        Парсить location проекту
        """
        try:
            print(f"📋 Парсинг location для проекту: {project_name}")
            
            # Якщо URL не надано, використовуємо правильний URL для MEDBLUE MARBELLA
            if not project_url:
                if project_name == "MEDBLUE MARBELLA":
                    project_url = "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93"
                else:
                    project_url = self._find_project_url(project_name)
                    if not project_url:
                        print(f"❌ Не знайдено URL для проекту: {project_name}")
                        return False
            
            # Переходимо на сторінку проекту
            print(f"Переходимо на: {project_url}")
            self.driver.get(project_url)
            time.sleep(Config.REQUEST_DELAY)
            
            # Зберігаємо скріншот сторінки проекту
            self.save_screenshot(f"{project_name.replace(' ', '_')}_location_page.png")
            
            # Шукаємо Google Maps карту на сторінці
            print("🗺️ Шукаємо Google Maps карту на сторінці...")
            
            # Перевіряємо чи є iframe з Google Maps
            try:
                iframe_maps = self.driver.find_elements(By.XPATH, "//iframe[contains(@src, 'maps') or contains(@src, 'google')]")
                if iframe_maps:
                    print(f"✅ Знайдено {len(iframe_maps)} Google Maps iframe")
                else:
                    print("ℹ️ Google Maps iframe не знайдено")
            except:
                print("ℹ️ Google Maps iframe не знайдено")
            
            # Перевіряємо чи є embed карти
            try:
                embed_maps = self.driver.find_elements(By.XPATH, "//embed[contains(@src, 'maps') or contains(@src, 'google')]")
                if embed_maps:
                    print(f"✅ Знайдено {len(embed_maps)} Google Maps embed")
                else:
                    print("ℹ️ Google Maps embed не знайдено")
            except:
                print("ℹ️ Google Maps embed не знайдено")
            
            # Витягуємо інформацію про location
            location_data = {
                "project_name": project_name,
                "url": project_url,
                "parsed_at": datetime.now().isoformat(),
                "location_images": self._extract_location_images(),
                "location_maps": self._extract_location_maps(),
                "location_links": self._extract_location_links(),
                "location_containers": self._extract_location_containers(),
                "location_text": self._extract_location_text(),
                "location_coordinates": self._extract_location_coordinates()
            }
            
            # Зберігаємо дані в JSON
            self._save_location_metadata(project_name, location_data)
            
            print(f"✅ Location збережено для проекту: {project_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Помилка парсингу location для {project_name}: {str(e)}")
            return False

    def _save_location_metadata(self, project_name, location_data):
        """Зберігає метадані location в initial.json"""
        try:
            # Створюємо папку для проекту, якщо її немає
            project_dir = os.path.join(self.projects_dir, project_name.replace(' ', '_'))
            if not os.path.exists(project_dir):
                os.makedirs(project_dir)
            
            # Шлях до initial.json
            initial_json_path = os.path.join(project_dir, "initial.json")
            
            # Завантажуємо існуючі дані або створюємо нові
            if os.path.exists(initial_json_path):
                with open(initial_json_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            else:
                existing_data = {
                    "project_metadata": {
                        "name": project_name,
                        "parsed_at": datetime.now().isoformat()
                    }
                }
            
            # Додаємо дані location
            existing_data["location"] = location_data
            
            # Зберігаємо оновлені дані
            with open(initial_json_path, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
            print("💾 Дані location додано до initial.json")
            
        except Exception as e:
            print(f"❌ Помилка збереження даних location: {str(e)}")

    def _extract_location_images(self):
        """Витягує зображення location"""
        try:
            location_images = []
            
            # Шукаємо зображення location по всій сторінці
            all_images = self.driver.find_elements(By.TAG_NAME, "img")
            location_keywords = ['location', 'ubicacion', 'map', 'mapa', 'area', 'zona', 'google']
            
            for i, img in enumerate(all_images):
                try:
                    src = img.get_attribute('src') or ''
                    alt = img.get_attribute('alt') or ''
                    title = img.get_attribute('title') or ''
                    
                    # Перевіряємо чи це зображення location
                    text_to_check = f"{alt} {title}".lower()
                    is_location_image = False
                    
                    for keyword in location_keywords:
                        if keyword in text_to_check or 'location' in src.lower() or 'map' in src.lower():
                            is_location_image = True
                            break
                    
                    if is_location_image and src:
                        location_images.append({
                            'index': i,
                            'src': src,
                            'alt': alt,
                            'title': title,
                            'location': 'page_wide'
                        })
                        
                except:
                    continue
            
            print(f"✅ Знайдено {len(location_images)} зображень location")
            return location_images
            
        except Exception as e:
            print(f"❌ Помилка витягування зображень location: {str(e)}")
            return []

    def _extract_location_maps(self):
        """Витягує карти location"""
        try:
            location_maps = []
            
            # Шукаємо iframe карти
            try:
                iframe_maps = self.driver.find_elements(By.XPATH, "//iframe[contains(@src, 'maps') or contains(@src, 'google')]")
                
                for i, iframe in enumerate(iframe_maps):
                    try:
                        src = iframe.get_attribute('src') or ''
                        width = iframe.get_attribute('width') or ''
                        height = iframe.get_attribute('height') or ''
                        
                        if src:
                            location_maps.append({
                                'index': i,
                                'src': src,
                                'width': width,
                                'height': height,
                                'type': 'iframe'
                            })
                    except:
                        continue
                        
            except:
                print("iframe карти не знайдено")
            
            # Шукаємо embed карти
            try:
                embed_maps = self.driver.find_elements(By.XPATH, "//embed[contains(@src, 'maps') or contains(@src, 'google')]")
                
                for i, embed in enumerate(embed_maps):
                    try:
                        src = embed.get_attribute('src') or ''
                        width = embed.get_attribute('width') or ''
                        height = embed.get_attribute('height') or ''
                        
                        if src:
                            location_maps.append({
                                'index': len(location_maps),
                                'src': src,
                                'width': width,
                                'height': height,
                                'type': 'embed'
                            })
                    except:
                        continue
                        
            except:
                print("embed карти не знайдено")
            
            print(f"✅ Знайдено {len(location_maps)} карт location")
            return location_maps
            
        except Exception as e:
            print(f"❌ Помилка витягування карт location: {str(e)}")
            return []

    def _extract_location_links(self):
        """Витягує посилання location"""
        try:
            location_links = []
            location_keywords = ['location', 'ubicacion', 'map', 'mapa', 'area', 'zona']
            
            # Шукаємо посилання location по всій сторінці
            
            for keyword in location_keywords:
                try:
                    links = self.driver.find_elements(By.XPATH, f"//a[contains(text(), '{keyword}') or contains(@href, '{keyword}')]")
                    
                    for link in links:
                        try:
                            href = link.get_attribute('href')
                            text = link.text.strip()
                            
                            if href and text:
                                # Перевіряємо чи це посилання ще не додано
                                already_exists = any(link_data['href'] == href for link_data in location_links)
                                if not already_exists:
                                    location_links.append({
                                        'text': text,
                                        'href': href,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(location_links)} посилань location")
            return location_links
            
        except Exception as e:
            print(f"❌ Помилка витягування посилань location: {str(e)}")
            return []

    def _extract_location_containers(self):
        """Витягує контейнери location"""
        try:
            location_containers = []
            location_keywords = ['location', 'ubicacion', 'map', 'mapa', 'area', 'zona']
            
            for keyword in location_keywords:
                try:
                    divs = self.driver.find_elements(By.XPATH, f"//div[contains(@class, '{keyword}') or contains(@id, '{keyword}')]")
                    
                    for div in divs:
                        try:
                            div_id = div.get_attribute('id') or ''
                            div_class = div.get_attribute('class') or ''
                            div_text = div.text.strip()[:200] if div.text else ''
                            
                            if div_id or div_class:
                                # Перевіряємо чи це контейнер ще не додано
                                already_exists = any(container['id'] == div_id and container['class'] == div_class for container in location_containers)
                                if not already_exists:
                                    location_containers.append({
                                        'id': div_id,
                                        'class': div_class,
                                        'text': div_text,
                                        'keyword': keyword
                                    })
                        except:
                            continue
                except:
                    continue
            
            print(f"✅ Знайдено {len(location_containers)} контейнерів location")
            return location_containers
            
        except Exception as e:
            print(f"❌ Помилка витягування контейнерів location: {str(e)}")
            return []

    def _extract_location_text(self):
        """Витягує текст location"""
        try:
            location_text = ""
            
            # Шукаємо текст location по всій сторінці
            try:
                # Шукаємо в контейнерах з location
                location_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'ubicacion') or contains(@class, 'location') or contains(@class, 'map')]")
                for container in location_containers:
                    container_text = container.text.strip()
                    if container_text:
                        location_text += container_text + "\n"
            except:
                pass
            
            # Якщо текст не знайдено, шукаємо в iframe з картами
            if not location_text:
                try:
                    iframe_maps = self.driver.find_elements(By.XPATH, "//iframe[contains(@src, 'maps') or contains(@src, 'google')]")
                    for iframe in iframe_maps:
                        src = iframe.get_attribute('src') or ''
                        if src:
                            location_text += f"Google Maps: {src}\n"
                except:
                    pass
            
            print(f"✅ Витягнуто текст location: {len(location_text)} символів")
            return location_text
            
        except Exception as e:
            print(f"❌ Помилка витягування тексту location: {str(e)}")
            return ""

    def _extract_location_coordinates(self):
        """Витягує координати location"""
        try:
            coordinates = {}
            
            # Шукаємо координати в тексті по всій сторінці
            try:
                # Отримуємо весь текст сторінки
                location_text = self.driver.find_element(By.TAG_NAME, "body").text.strip()
                
                # Шукаємо координати в форматі lat/lng або latitude/longitude
                import re
                
                # Патерн для координат
                lat_pattern = r'lat[itude]*[:\s]*([0-9.-]+)'
                lng_pattern = r'lon[gitude]*[:\s]*([0-9.-]+)'
                
                lat_match = re.search(lat_pattern, location_text, re.IGNORECASE)
                lng_match = re.search(lng_pattern, location_text, re.IGNORECASE)
                
                if lat_match:
                    coordinates['latitude'] = float(lat_match.group(1))
                if lng_match:
                    coordinates['longitude'] = float(lng_match.group(1))
                    
            except:
                print("Координати в тексті не знайдено")
            
            # Шукаємо координати в iframe src
            try:
                iframe_maps = self.driver.find_elements(By.XPATH, "//iframe[contains(@src, 'maps')]")
                for iframe in iframe_maps:
                    src = iframe.get_attribute('src') or ''
                    
                    # Шукаємо координати в URL Google Maps
                    import re
                    coord_pattern = r'!3d([0-9.-]+)!4d([0-9.-]+)'
                    coord_match = re.search(coord_pattern, src)
                    
                    if coord_match and not coordinates:
                        coordinates['latitude'] = float(coord_match.group(1))
                        coordinates['longitude'] = float(coord_match.group(2))
                        break
                        
            except:
                print("Координати в iframe не знайдено")
            
            print(f"✅ Знайдено координати: {coordinates}")
            return coordinates
            
        except Exception as e:
            print(f"❌ Помилка витягування координат: {str(e)}")
            return {}
