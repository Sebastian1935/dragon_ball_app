# Copyright (c) 2025, Sebastian and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
import requests
import json

class DragonBallCharacter(Document):
	pass

@frappe.whitelist()
def sync_all_characters():
    """Sync all characters with pagination"""
    try:
        page = 1
        limit = 50  # Puedes ajustar este valor si quieres traer más por página
        total_synced = 0

        while True:
            response = requests.get(f"https://dragonball-api.com/api/characters?page={page}&limit={limit}")
            if response.status_code != 200:
                break

            data = response.json()
            characters = data.get('items', [])
            if not characters:
                break  # Ya no hay más personajes

            for char_data in characters:
                existing = frappe.db.exists('Dragon Ball Character',
                                            {'character_id': str(char_data.get('id'))})

                if not existing:
                    doc = frappe.new_doc('Dragon Ball Character')
                else:
                    doc = frappe.get_doc('Dragon Ball Character', existing)

                doc.character_id = str(char_data.get('id'))
                doc.character_name = char_data.get('name')
                doc.ki = char_data.get('ki')
                doc.max_ki = char_data.get('maxKi')
                doc.race = char_data.get('race')
                doc.gender = char_data.get('gender')
                doc.description = char_data.get('description')
                doc.image_url = char_data.get('image')

                # Obtener detalle completo del personaje
                detail_response = requests.get(f"https://dragonball-api.com/api/characters/{char_data.get('id')}")
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    doc.transformations = []
                    for trans in detail_data.get('transformations', []):
                        doc.append('transformations', {
                            'transformation_id': str(trans.get('id')),
                            'transformation_name': trans.get('name'),
                            'image': trans.get('image'),
                            'ki': trans.get('ki')
                        })

                doc.save()
                total_synced += 1
                print(f"[{total_synced}] {doc.character_name} saved")

            page += 1

        frappe.db.commit()
        return f"Synced {total_synced} characters successfully."

    except Exception as e:
        frappe.log_error(f"Error syncing characters: {str(e)}")
        return f"Error: {str(e)}"

@frappe.whitelist()
def update_single_character(character_id):
    """Update a single character"""
    try:
        response = requests.get(f"https://dragonball-api.com/api/characters/{character_id}")
        if response.status_code == 200:
            char_data = response.json()
            return True
    except Exception as e:
        frappe.log_error(f"Error updating character: {str(e)}")
        return False

@frappe.whitelist()
def get_dashboard_data():
    """Obtiene datos para el dashboard"""
    try:
        # General statistics
        total_characters = frappe.db.count('Dragon Ball Character')
        
        # Unique races
        races = frappe.db.sql("""
            SELECT DISTINCT race, COUNT(*) as count 
            FROM `tabDragon Ball Character` 
            WHERE race IS NOT NULL 
            GROUP BY race
        """, as_dict=True)
        
        # Top 10 characters
        top_characters = frappe.db.sql("""
            SELECT name, character_name, ki, max_ki, race, image_url, gender
            FROM `tabDragon Ball Character`
            ORDER BY CAST(ki AS UNSIGNED) DESC
            LIMIT 10
        """, as_dict=True)
        
        # Gender distribution
        gender_distribution = frappe.db.sql("""
            SELECT gender, COUNT(*) as count
            FROM `tabDragon Ball Character`
            WHERE gender IS NOT NULL
            GROUP BY gender
        """, as_dict=True)
        
        # Recent characters
        recent_characters = frappe.db.sql("""
            SELECT character_name, ki, race, image_url, creation
            FROM `tabDragon Ball Character`
            ORDER BY creation DESC
            LIMIT 5
        """, as_dict=True)
        
        # Transformation stats
        transformation_stats = frappe.db.sql("""
            SELECT 
                COUNT(DISTINCT parent) as characters_with_transformations,
                COUNT(*) as total_transformations
            FROM `tabTransformation`
        """, as_dict=True)[0] if frappe.db.exists('DocType', 'Transformation') else {}
        
        return {
            'total_characters': total_characters,
            'races': races,
            'top_characters': top_characters,
            'gender_distribution': gender_distribution,
            'recent_characters': recent_characters,
            'transformation_stats': transformation_stats
        }
        
    except Exception as e:
        frappe.log_error(f"Dashboard Error: {str(e)}")
        return {}

@frappe.whitelist()
def search_characters(search_term="", race_filter="", gender_filter=""):
    
    filters = {}
    
    if search_term:
        filters['character_name'] = ['like', f'%{search_term}%']
    if race_filter and race_filter != "All":
        filters['race'] = race_filter
    if gender_filter and gender_filter != "All":
        filters['gender'] = gender_filter
    
    characters = frappe.get_all('Dragon Ball Character',
        filters=filters,
        fields=['name', 'character_name', 'ki', 'max_ki', 'race', 
                'gender', 'image_url', 'character_id'],
        order_by='ki desc',
        limit=50
    )
    
    return characters

@frappe.whitelist()
def get_character_details(character_name):
    """Obtiene detalles completos de un personaje incluyendo transformaciones"""
    character = frappe.get_doc('Dragon Ball Character', character_name)
    
    # Transformations
    transformations = frappe.get_all('Transformation',
        filters={'parent': character_name},
        fields=['transformation_name', 'ki', 'image']
    )
    
    return {
        'character': character.as_dict(),
        'transformations': transformations
    }