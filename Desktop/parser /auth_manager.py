import time
import os
import json
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from config import Config

class AuthManager:
    def __init__(self):
        self.driver = None
        self.is_authenticated = False
        
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
    
    def save_session(self):
        """Збереження сесії (cookies)"""
        try:
            if self.driver and self.is_authenticated:
                cookies = self.driver.get_cookies()
                session_data = {
                    "timestamp": datetime.now().isoformat(),
                    "cookies": cookies,
                    "url": self.driver.current_url
                }
                
                os.makedirs(os.path.dirname(Config.SESSION_FILE), exist_ok=True)
                with open(Config.SESSION_FILE, 'w', encoding='utf-8') as f:
                    json.dump(session_data, f, ensure_ascii=False, indent=2)
                
                print(f"Сесія збережена: {Config.SESSION_FILE}")
                return True
        except Exception as e:
            print(f"Помилка збереження сесії: {str(e)}")
        return False
    
    def load_session(self):
        """Завантаження сесії (cookies)"""
        try:
            if not os.path.exists(Config.SESSION_FILE):
                print("Файл сесії не знайдено")
                return False
            
            with open(Config.SESSION_FILE, 'r', encoding='utf-8') as f:
                session_data = json.load(f)
            
            # Перевіряємо чи не застаріла сесія
            session_time = datetime.fromisoformat(session_data["timestamp"])
            if datetime.now() - session_time > timedelta(seconds=Config.SESSION_DURATION):
                print("Сесія застаріла")
                return False
            
            # Переходимо на головну сторінку
            self.driver.get(Config.BASE_URL)
            time.sleep(2)
            
            # Встановлюємо cookies
            for cookie in session_data["cookies"]:
                try:
                    self.driver.add_cookie(cookie)
                except:
                    continue
            
            # Перезавантажуємо сторінку з cookies
            self.driver.refresh()
            time.sleep(3)
            
            # Перевіряємо чи авторизація все ще дійсна
            if self._check_auth_success():
                self.is_authenticated = True
                print("✅ Сесія відновлена успішно!")
                return True
            else:
                print("Сесія недійсна")
                return False
                
        except Exception as e:
            print(f"Помилка завантаження сесії: {str(e)}")
            return False
    
    def clear_session(self):
        """Очищення збереженої сесії"""
        try:
            if os.path.exists(Config.SESSION_FILE):
                os.remove(Config.SESSION_FILE)
                print("Сесія очищена")
        except Exception as e:
            print(f"Помилка очищення сесії: {str(e)}")
        
    def setup_driver(self):
        """Налаштування веб-драйвера"""
        chrome_options = Options()
        
        if Config.HEADLESS:
            chrome_options.add_argument("--headless")
        
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument(f"--user-agent={Config.USER_AGENT}")
        
        # Додаткові налаштування для стабільності
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        try:
            # Спробуємо автоматичне визначення
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
        except Exception as e:
            print(f"Помилка автоматичного визначення ChromeDriver: {str(e)}")
            try:
                # Спробуємо вручну вказати архітектуру
                import platform
                if platform.machine() == 'arm64':
                    service = Service(ChromeDriverManager(os_type="mac_arm64").install())
                else:
                    service = Service(ChromeDriverManager(os_type="mac64").install())
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
            except Exception as e2:
                print(f"Помилка ручного визначення ChromeDriver: {str(e2)}")
                # Остання спроба - без service
                self.driver = webdriver.Chrome(options=chrome_options)
        
        # Приховуємо автоматизацію
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        return self.driver
    
    def accept_cookies(self):
        """Прийняття cookies"""
        try:
            print("🔍 Шукаємо кнопку прийняття cookies...")
            
            # Різні селектори для кнопок cookies
            cookie_selectors = [
                "//button[@id='gdpr-cookie-accept']",
                "//button[contains(text(), 'Accept')]",
                "//button[contains(text(), 'OK')]",
                "//button[contains(text(), 'Got it')]",
                "//a[contains(text(), 'Accept')]",
                "//div[contains(@class, 'cookie')]//button",
                "//button[contains(@class, 'cookie')]"
            ]
            
            for selector in cookie_selectors:
                try:
                    cookie_button = WebDriverWait(self.driver, 3).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    cookie_button.click()
                    print("✅ Cookies прийнято")
                    time.sleep(2)
                    return True
                except:
                    continue
            
            print("ℹ️ Кнопка cookies не знайдена або вже прийнята")
            return True
            
        except Exception as e:
            print(f"❌ Помилка прийняття cookies: {str(e)}")
            return False
    
    def click_agents_button(self):
        """Клік на кнопку agents"""
        try:
            print("🔍 Шукаємо кнопку agents...")
            
            # Різні селектори для кнопки agents
            agents_selectors = [
                "//div[@class='b_agentes_top']//a[contains(text(), 'agents')]",
                "//a[contains(text(), 'agents')]",
                "//a[contains(text(), 'Agents')]",
                "//a[contains(text(), 'AGENTS')]",
                "//div[contains(@class, 'agent')]//a",
                "//a[contains(@href, 'agent')]"
            ]
            
            for selector in agents_selectors:
                try:
                    agent_button = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    
                    # Прокручуємо до елемента
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", agent_button)
                    time.sleep(1)
                    
                    # Клікаємо
                    agent_button.click()
                    print("✅ Клікнуто на кнопку agents")
                    time.sleep(3)
                    return True
                except:
                    continue
            
            print("❌ Кнопка agents не знайдена")
            return False
            
        except Exception as e:
            print(f"❌ Помилка кліку на кнопку agents: {str(e)}")
            return False
    
    def fill_login_form(self):
        """Заповнення форми авторизації"""
        try:
            print("📝 Заповнюємо форму авторизації...")
            
            # Поле username
            try:
                username_field = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.ID, "login_usuario"))
                )
                username_field.clear()
                username_field.send_keys(Config.LOGIN_EMAIL)
                print("✅ Введено email")
            except:
                print("❌ Поле username не знайдено")
                return False
            
            # Поле password
            try:
                password_field = self.driver.find_element(By.ID, "login_contrasena")
                password_field.clear()
                password_field.send_keys(Config.LOGIN_PASSWORD)
                print("✅ Введено password")
            except:
                print("❌ Поле password не знайдено")
                return False
            
            # Кнопка LOGIN
            try:
                login_button = self.driver.find_element(By.XPATH, "//input[@type='submit' and @value='LOGIN']")
                login_button.click()
                print("✅ Клікнуто на кнопку LOGIN")
                time.sleep(8)  # Чекаємо обробки форми
                return True
            except:
                print("❌ Кнопка LOGIN не знайдена")
                return False
                
        except Exception as e:
            print(f"❌ Помилка заповнення форми: {str(e)}")
            return False
    
    def login(self):
        """Повна авторизація на сайті"""
        try:
            print("🚀 Починаю авторизацію...")
            
            # Переходимо на головну сторінку
            self.driver.get(Config.BASE_URL)
            time.sleep(3)
            
            # Зберігаємо скріншот головної сторінки
            self.save_screenshot("main_page.png")
            
            # Крок 1: Приймаємо cookies
            if not self.accept_cookies():
                print("⚠️ Не вдалося прийняти cookies, продовжуємо...")
            
            # Крок 2: Клікаємо на кнопку agents
            if not self.click_agents_button():
                print("❌ Не вдалося знайти кнопку agents")
                return False
            
            # Зберігаємо скріншот модального вікна
            self.save_screenshot("login_modal.png")
            
            # Крок 3: Заповнюємо форму авторизації
            if not self.fill_login_form():
                print("❌ Не вдалося заповнити форму авторизації")
                return False
            
            # Зберігаємо скріншот після спроби входу
            self.save_screenshot("after_login.png")
            
            # Крок 4: Перевіряємо успішність авторизації
            if self._check_auth_success():
                self.is_authenticated = True
                print("✅ Авторизація успішна!")
                
                # Зберігаємо сесію
                self.save_session()
                
                return True
            else:
                print("❌ Авторизація не вдалася")
                return False
                
        except Exception as e:
            print(f"❌ Помилка під час авторизації: {str(e)}")
            return False
    
    def _check_auth_success(self):
        """Перевірка успішності авторизації"""
        try:
            print("🔍 Перевіряємо успішність авторизації...")
            
            # Перевіряємо наявність елементів, які з'являються після успішної авторизації
            auth_indicators = [
                "//div[contains(@class, 'agent')]",
                "//a[contains(text(), 'logout')]",
                "//a[contains(text(), 'Logout')]",
                "//span[contains(@class, 'user-name')]",
                "//div[contains(@class, 'dashboard')]",
                "//a[contains(@href, 'logout')]"
            ]
            
            for indicator in auth_indicators:
                try:
                    element = self.driver.find_element(By.XPATH, indicator)
                    if element:
                        print(f"✅ Знайдено індикатор авторизації: {indicator}")
                        return True
                except:
                    continue
            
            # Перевіряємо відсутність форми входу
            try:
                login_form = self.driver.find_element(By.XPATH, "//input[@id='login_usuario']")
                print("❌ Форма входу все ще присутня")
                return False
            except:
                print("✅ Форма входу відсутня - можливо авторизація успішна")
                return True
                
        except Exception as e:
            print(f"❌ Помилка перевірки авторизації: {str(e)}")
            return False
    
    def logout(self):
        """Вихід з системи"""
        try:
            logout_button = self.driver.find_element(By.XPATH, "//a[contains(text(), 'logout') or contains(text(), 'Logout')]")
            logout_button.click()
            time.sleep(2)
            self.is_authenticated = False
            print("✅ Вихід з системи успішний")
        except Exception as e:
            print(f"❌ Помилка виходу: {str(e)}")
    
    def close(self):
        """Закриття браузера"""
        if self.driver:
            self.driver.quit()
            print("Браузер закрито")
