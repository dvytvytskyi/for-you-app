#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import time
import json
from auth_manager import AuthManager
from project_parser import ProjectParser
from config import Config

def main():
    """Основний функціонал парсера"""
    auth_manager = AuthManager()
    
    try:
        print("Запуск парсера Azul Developments...")
        
        # Налаштування браузера
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if not auth_manager.login():
            print("Помилка авторизації. Завершення роботи.")
            return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Отримання списку проектів
        projects_list = parser.get_projects_list()
        
        if not projects_list:
            print("Не вдалося отримати список проектів.")
            return
        
        print(f"Знайдено {len(projects_list)} проектів")
        
        # Отримання детальної інформації по кожному проекту
        detailed_projects = []
        
        for i, project in enumerate(projects_list, 1):
            print(f"\nОбробка проекту {i}/{len(projects_list)}: {project.get('name', 'Невідомий проект')}")
            
            try:
                project_details = parser.get_project_details(project['url'])
                if project_details:
                    # Об'єднуємо базову інформацію з деталями
                    full_project_data = {**project, **project_details}
                    detailed_projects.append(full_project_data)
                    
                    # Зберігаємо кожен проект окремо
                    project_filename = f"data/project_{i}_{project.get('name', 'unknown').replace(' ', '_').replace('/', '_')}.json"
                    os.makedirs(os.path.dirname(project_filename), exist_ok=True)
                    with open(project_filename, 'w', encoding='utf-8') as f:
                        json.dump(full_project_data, f, ensure_ascii=False, indent=2)
                    
                    print(f"Проект збережено: {project_filename}")
                
                # Затримка між запитами
                time.sleep(Config.REQUEST_DELAY)
                
            except Exception as e:
                print(f"Помилка обробки проекту {project.get('name', 'Невідомий')}: {str(e)}")
                continue
        
        # Зберігаємо всі проекти в один файл
        if detailed_projects:
            os.makedirs("data", exist_ok=True)
            with open("data/all_projects_detailed.json", 'w', encoding='utf-8') as f:
                json.dump(detailed_projects, f, ensure_ascii=False, indent=2)
            print(f"\nВсі проекти збережено у файл: data/all_projects_detailed.json")
            print(f"Всього оброблено: {len(detailed_projects)} проектів")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Критична помилка: {str(e)}")
    
    finally:
        # Закриття браузера
        auth_manager.close()

def test_auth():
    """Тестування авторизації"""
    auth_manager = AuthManager()
    
    try:
        print("Тестування авторизації...")
        driver = auth_manager.setup_driver()
        
        # Спочатку намагаємося завантажити збережену сесію
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
            auth_manager.save_screenshot("auth_success.png")
        else:
            print("Збережена сесія не знайдена або застаріла, виконуємо авторизацію...")
            if auth_manager.login():
                print("✅ Авторизація успішна!")
                auth_manager.save_screenshot("auth_success.png")
            else:
                print("❌ Помилка авторизації")
        
        auth_manager.logout()
            
    except Exception as e:
        print(f"Помилка тестування: {str(e)}")
    
    finally:
        auth_manager.close()

def get_projects_list_only():
    """Отримання тільки списку проектів без деталей"""
    auth_manager = AuthManager()
    
    try:
        driver = auth_manager.setup_driver()
        
        # Спочатку намагаємося завантажити збережену сесію
        if auth_manager.load_session():
            print("Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена або застаріла, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації")
                return
        
        parser = ProjectParser(driver)
        projects = parser.get_projects_list()
        
        if projects:
            # Зберігаємо список проектів
            parser.save_projects_to_file("data/all_projects.json")
            print(f"Список проектів збережено: data/all_projects.json")
            
            # Створюємо папки для проектів
            parser.create_project_folders()
        
        auth_manager.logout()
            
    except Exception as e:
        print(f"Помилка: {str(e)}")
    
    finally:
        auth_manager.close()

def parse_general_info(project_name=None):
    """Парсинг general_info для проекту"""
    if not project_name:
        project_name = "MEDBLUE MARBELLA"  # За замовчуванням
    print(f"Парсинг general_info для {project_name}...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг general_info для конкретного проекту
        success = parser.parse_project_general_info(project_name)
        
        if success:
            print(f"✅ General_info успішно зпарсено та збережено для {project_name}")
        else:
            print(f"❌ Помилка парсингу general_info для {project_name}")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

def parse_media(project_name=None):
    """Парсинг media для проекту"""
    if not project_name:
        project_name = "MEDBLUE MARBELLA"  # За замовчуванням
    print(f"Парсинг media для {project_name}...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг media для конкретного проекту
        success = parser.parse_project_media(project_name)
        
        if success:
            print(f"✅ Media успішно зпарсено та збережено для {project_name}")
        else:
            print(f"❌ Помилка парсингу media для {project_name}")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

def parse_price_availability():
    """Парсинг Price&Availability для MEDBLUE MARBELLA"""
    print("Парсинг Price&Availability для MEDBLUE MARBELLA...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг Price&Availability для конкретного проекту
        success = parser.parse_project_price_availability("MEDBLUE MARBELLA")
        
        if success:
            print("✅ Price&Availability успішно зпарсено та збережено")
        else:
            print("❌ Помилка парсингу Price&Availability")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

def parse_plans(project_name=None):
    """Парсинг планів для проекту"""
    if not project_name:
        project_name = "MEDBLUE MARBELLA"  # За замовчуванням
    print(f"Парсинг планів для {project_name}...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг планів для конкретного проекту
        success = parser.parse_project_plans(project_name)
        
        if success:
            print(f"✅ Плани успішно зпарсено та збережено для {project_name}")
        else:
            print(f"❌ Помилка парсингу планів для {project_name}")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

def parse_location():
    """Парсинг location для MEDBLUE MARBELLA"""
    print("Парсинг location для MEDBLUE MARBELLA...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг location для конкретного проекту
        success = parser.parse_project_location("MEDBLUE MARBELLA")
        
        if success:
            print("✅ Location успішно зпарсено та збережено")
        else:
            print("❌ Помилка парсингу location")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

def parse_brochure():
    """Парсинг brochure для MEDBLUE MARBELLA"""
    print("Парсинг brochure для MEDBLUE MARBELLA...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг brochure для конкретного проекту
        success = parser.parse_project_brochure("MEDBLUE MARBELLA")
        
        if success:
            print("✅ Brochure успішно зпарсено та збережено")
        else:
            print("❌ Помилка парсингу brochure")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

def parse_quality_specs():
    """Парсинг quality specifications для MEDBLUE MARBELLA"""
    print("Парсинг quality specifications для MEDBLUE MARBELLA...")
    
    auth_manager = AuthManager()
    try:
        driver = auth_manager.setup_driver()
        
        # Авторизація
        if auth_manager.load_session():
            print("✅ Використовуємо збережену сесію")
        else:
            print("Збережена сесія не знайдена, виконуємо авторизацію...")
            if not auth_manager.login():
                print("Помилка авторизації. Завершення роботи.")
                return
        
        # Створення парсера проектів
        parser = ProjectParser(driver)
        
        # Парсинг quality specifications для конкретного проекту
        success = parser.parse_project_quality_specs("MEDBLUE MARBELLA")
        
        if success:
            print("✅ Quality specifications успішно зпарсено та збережено")
        else:
            print("❌ Помилка парсингу quality specifications")
        
        # Вихід з системи
        auth_manager.logout()
        
    except Exception as e:
        print(f"Помилка: {str(e)}")
    finally:
        auth_manager.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "test":
            test_auth()
        elif command == "list":
            get_projects_list_only()
        elif command == "full":
            main()
        elif command == "clear":
            auth_manager = AuthManager()
            auth_manager.clear_session()
        elif command == "general_info":
            project_name = sys.argv[2] if len(sys.argv) > 2 else None
            parse_general_info(project_name)
        elif command == "media":
            project_name = sys.argv[2] if len(sys.argv) > 2 else None
            parse_media(project_name)
        elif command == "price":
            parse_price_availability()
        elif command == "plans":
            project_name = sys.argv[2] if len(sys.argv) > 2 else None
            parse_plans(project_name)
        elif command == "quality":
            parse_quality_specs()
        elif command == "brochure":
            parse_brochure()
        elif command == "location":
            parse_location()
        else:
            print("Доступні команди:")
            print("  python main.py test  - тестування авторизації")
            print("  python main.py list  - отримання списку проектів")
            print("  python main.py full  - повний парсинг (за замовчуванням)")
            print("  python main.py clear - очищення збереженої сесії")
            print("  python main.py general_info - парсинг general_info для MEDBLUE MARBELLA")
            print("  python main.py media - парсинг media для MEDBLUE MARBELLA")
            print("  python main.py price - парсинг Price&Availability для MEDBLUE MARBELLA")
            print("  python main.py plans - парсинг планів для MEDBLUE MARBELLA")
            print("  python main.py quality - парсинг quality specifications для MEDBLUE MARBELLA")
            print("  python main.py brochure - парсинг brochure для MEDBLUE MARBELLA")
            print("  python main.py location - парсинг location для MEDBLUE MARBELLA")
    else:
        # За замовчуванням запускаємо повний парсинг
        main()
