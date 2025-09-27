import os
import shutil
import random
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.models import Base, Product, Category
from app.config import settings

# --- DATABASE SETUP ---
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- CONFIGURATION ---
STATIC_IMAGES_DIR = 'app/static/images/products'

# --- PRODUCT NAME MAPPING (Expanded for better variety) ---
PRODUCT_NAME_MAPPING = {
    # Men's T-Shirts
    'hm_men_t-shirts_1.jpg': 'Light Blue Regular Fit T-Shirt',
    'hm_men_t-shirts_2.jpg': 'White Slim Fit T-Shirt',
    'hm_men_t-shirts_3.jpg': 'Sky Blue Crewneck T-Shirt',
    'hm_men_t-shirts_4.jpg': 'Light Blue Embroidered T-Shirt',
    'hm_men_t-shirts_5.jpg': 'Black Classic T-Shirt',
    'hm_men_t-shirts_6.jpg': 'Dark Chocolate Brown T-Shirt',
    'hm_men_t-shirts_7.jpg': 'Light Pink Soft Cotton T-Shirt',
    'hm_men_t-shirts_8.jpg': 'Off-White Relaxed Fit T-Shirt',
    'hm_men_t-shirts_9.jpg': 'Burgundy Crewneck T-Shirt',
    'hm_men_t-shirts_10.jpg': 'Black Long-Sleeved Polo Shirt',
    'hm_men_t-shirts_11.jpg': 'Heather Grey T-Shirt',
    'hm_men_t-shirts_12.jpg': 'Rust Brown Crewneck T-Shirt',

    # Men's Jeans
    'hm_men_jeans_1.jpg': 'Vintage Wash Baggy Jeans',
    'hm_men_jeans_2.jpg': 'Light Wash Straight Leg Jeans',
    'hm_men_jeans_3.jpg': 'Classic Black Slim Jeans',
    'hm_men_jeans_4.jpg': 'Olive Green Cargo Jeans',
    'hm_men_jeans_5.jpg': 'Sky Blue Relaxed Fit Jeans',
    'hm_men_jeans_6.jpg': 'Washed Black Straight Jeans',
    'hm_men_jeans_7.jpg': '90s Style Baggy Jeans',
    'hm_men_jeans_8.jpg': 'Loose Fit Black Jeans',
    'hm_men_jeans_9.jpg': 'Relaxed Fit Washed Black Jeans',
    'hm_men_jeans_10.jpg': 'Light Grey Baggy Jeans',
    'hm_men_jeans_11.jpg': 'Deep Indigo Regular Jeans',

    # Men's Shirts
    'hm_men_shirts_1.jpg': 'Brown Corduroy Shirt',
    'hm_men_shirts_2.jpg': 'Black Regular Fit Lyocell Shirt',
    'hm_men_shirts_3.jpg': 'Light Blue Oxford Shirt',
    'hm_men_shirts_4.jpg': 'Black Short Sleeve Resort Shirt',
    'hm_men_shirts_5.jpg': 'Beige Striped Linen-blend Shirt',
    'hm_men_shirts_6.jpg': 'Blue Plaid Flannel Shirt',
    'hm_men_shirts_7.jpg': 'Light Blue Pinstripe Shirt',
    'hm_men_shirts_8.jpg': 'White Regular Fit Linen Shirt',
    'hm_men_shirts_9.jpg': 'Dark Green Twill Shirt Jacket',
    'hm_men_shirts_10.jpg': 'Pink Striped Resort Shirt',
    'hm_men_shirts_11.jpg': 'Brown Regular Fit Corduroy Shirt',
    'hm_men_shirts_12.jpg': 'Beige Regular Fit Oxford Shirt',

    # Men's Trousers
    'hm_men_trousers_1.jpg': 'Brown Slim Fit Suit Trousers',
    'hm_men_trousers_2.jpg': 'Grey Patterned Pyjama Bottoms',
    'hm_men_trousers_3.jpg': 'Grey Pleated Wide Trousers',
    'hm_men_trousers_4.jpg': 'Beige Regular Fit Twill Trousers',
    'hm_men_trousers_5.jpg': 'Grey Regular Fit Twill Trousers',
    'hm_men_trousers_6.jpg': 'Grey Zip-hem Track Pants',
    'hm_men_trousers_7.jpg': 'Black Loose Fit Joggers',
    'hm_men_trousers_8.jpg': 'Light Beige Cargo Trousers',
    'hm_men_trousers_9.jpg': 'Black Slim Fit Tailored Trousers',
    'hm_men_trousers_10.jpg': 'Linen-blend Drawstring Trousers',
    'hm_men_trousers_11.jpg': 'Black Loose Fit Linen-blend Trousers',

    # Men's Shoes
    'hm_men_shoes_1.jpg': 'Tan Faux Leather Flip-flops',
    'hm_men_shoes_2.jpg': 'Brown Padded Flip-flops',
    'hm_men_shoes_3.jpg': 'Black Leather Trainers',
    'hm_men_shoes_4.jpg': 'White Classic Trainers',
    'hm_men_shoes_5.jpg': 'Beige Suede Trainers',

    # Women's Trousers
    'hm_women_trousers_1.jpg': 'Black Tailored Fit Trousers',
    'hm_women_trousers_2.jpg': 'Heather Grey Yoga Pants',
    'hm_women_trousers_3.jpg': 'Navy Blue Cropped Leggings',
    'hm_women_trousers_4.jpg': 'Black Ruched Biker Shorts',
    'hm_women_trousers_5.jpg': 'Black Cigarette Trousers',
    'hm_women_trousers_6.jpg': 'Coated-look Biker Leggings',
    'hm_women_trousers_7.jpg': 'Fold-over Waist Leggings',

    # Women's Shirts
    'hm_women_shirts_1.jpg': 'Striped Crop Polo Shirt',
    'hm_women_shirts_2.jpg': 'Classic White Button-Down Shirt',
    'hm_women_shirts_3.jpg': 'Burgundy Silk Blend Blouse',
    'hm_women_shirts_4.jpg': 'Fitted White Polo Shirt',
    'hm_women_shirts_5.jpg': 'Camel Short-Sleeve Polo',
    'hm_women_shirts_6.jpg': 'Oversized Poplin Shirt',
    'hm_women_shirts_7.jpg': 'White Frill-trimmed Blouse',
    'hm_women_shirts_8.jpg': 'Ribbed Polo-neck Top',
    'hm_women_shirts_9.jpg': 'Navy Blue Long-sleeved Blouse',

    # Women's Jeans
    'hm_women_jeans_1.jpg': 'Grey Mom-Fit Jeans',
    'hm_women_jeans_2.jpg': 'Light Wash Flare Jeans',
    'hm_women_jeans_3.jpg': 'Dark Wash Wide-Leg Jeans',
    'hm_women_jeans_4.jpg': 'Leopard Print Flare Jeans',
    'hm_women_jeans_5.jpg': 'Classic Blue Bootcut Jeans',
    'hm_women_jeans_6.jpg': 'Brown Straight Leg Jeans',
    'hm_women_jeans_7.jpg': 'High-Waist Flare Jeans',
    'hm_women_jeans_8.jpg': 'White Wide Leg Sailor Jeans',
    'hm_women_jeans_9.jpg': 'Creamy White Wide Leg Jeans',
    'hm_women_jeans_10.jpg': 'Low-rise Flared Jeans',
    'hm_women_jeans_11.jpg': 'Black Flared Low Jeans',

    # Women's Shoes
    'hm_women_shoes_1.jpg': 'Brown Braided Leather Slides',
    'hm_women_shoes_2.jpg': 'Black Satin Slides',
    'hm_women_shoes_3.jpg': 'Brown Bow-detail Ballet Flats',
    'hm_women_shoes_4.jpg': 'Beige Ballet Flats',
    'hm_women_shoes_5.jpg': 'Leopard Print Mary Jane Flats',
    'hm_women_shoes_6.jpg': 'Black Suede Ballet Flats',
    'hm_women_shoes_7.jpg': 'Black Buckle Detail Mary Janes',
    'hm_women_shoes_8.jpg': 'Brown Suede Platform Loafers',
    'hm_women_shoes_9.jpg': 'Black Woven Leather Flats',
    'hm_women_shoes_10.jpg': 'Brown Mary Jane Flats',
    'hm_women_shoes_11.jpg': 'Black Croc-Pattern Flip-flops',
}

# --- INTELLIGENT FALLBACK NAME GENERATION ---
FALLBACK_ADJECTIVES = {
    'jeans': ['Relaxed Fit', 'Vintage Wash', 'High-Waist', 'Straight Leg', 'Classic'],
    'shirts': ['Oversized', 'Linen-Blend', 'Regular Fit', 'Silk-Blend', 'Poplin'],
    't-shirts': ['Cotton Crewneck', 'Slim Fit', 'Graphic Print', 'Relaxed Fit', 'Heavyweight'],
    'trousers': ['Tailored', 'Wide-Leg', 'Cargo', 'Pleated', 'Slim Fit'],
    'shoes': ['Leather', 'Suede', 'Canvas', 'Platform', 'Heeled'],
}

# --- HELPER FUNCTIONS ---

def get_or_create_category(db_session, category_name, category_slug):
    """Gets a category from the DB or creates it if it doesn't exist."""
    category = db_session.query(Category).filter_by(slug=category_slug).first()
    if not category:
        category = Category(name=category_name, slug=category_slug)
        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)
        print(f"Created new category: '{category_name}'")
    return category

def format_product_name(file_name, category_name, category_slug):
    """Gets a descriptive product name from mapping or generates a smart fallback."""
    if file_name in PRODUCT_NAME_MAPPING:
        return PRODUCT_NAME_MAPPING[file_name]

    # Smart fallback generation
    base_type = category_name.split()[-1] # e.g., "Men Jeans" -> "Jeans"
    adjectives = FALLBACK_ADJECTIVES.get(base_type.lower(), ['Stylish'])
    
    adjective = random.choice(adjectives)
    
    # Ensure the generated name is unique to avoid conflicts
    number_suffix = os.path.splitext(file_name)[0].split('_')[-1]
    return f"{adjective} {category_name} {number_suffix}"

def clear_database(session):
    """Deletes all products and categories from the database."""
    session.query(Product).delete()
    session.query(Category).delete()
    session.commit()
    print("🗑️  Cleared all existing products and categories from the database.")

def seed_data():
    """Main function to seed the database with products from image files."""
    db = SessionLocal()
    try:
        clear_database(db)

        # Get the list of all image files that were copied to STATIC_IMAGES_DIR
        all_image_files = os.listdir(STATIC_IMAGES_DIR)
        
        # Group images by category based on their filename prefix (e.g., 'hm_men_t-shirts')
        products_by_category = {}
        for file_name in all_image_files:
            prefix = "_".join(file_name.split('_')[:3]).replace('-', '_') # e.g., 'hm_men_t-shirts'
            if prefix not in products_by_category:
                products_by_category[prefix] = []
            products_by_category[prefix].append(file_name)

        processed_products = set()

        for category_slug_prefix, file_names in products_by_category.items():
            category_name = category_slug_prefix.replace('hm_', '').replace('_', ' ').title()
            category_slug = category_slug_prefix
            category_obj = get_or_create_category(db, category_name, category_slug)
            
            for file_name in file_names:
                product_name = format_product_name(file_name, category_name, category_slug)
                
                # Ensure product name is unique
                original_name = product_name
                counter = 1
                while product_name in processed_products:
                    product_name = f"{original_name} {counter}"
                    counter += 1
                processed_products.add(product_name)

                image_url = f"/static/images/products/{file_name}"
                
                new_product = Product(
                    name=product_name,
                    price=round(random.uniform(500, 5000), 2),
                    description=f"A high-quality '{product_name}' from our latest collection.",
                    stock=random.randint(5, 50),
                    category_id=category_obj.id,
                    image=image_url,
                    slug=f"{category_slug}-{os.path.splitext(file_name)[0]}"
                )
                db.add(new_product)
        
        db.commit()
        print("\n✅ Successfully seeded the database with new products!")

    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
