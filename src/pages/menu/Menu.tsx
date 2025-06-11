import React, { useState, useEffect } from "react";
import styles from "./Menu.module.css";
import { FaSearch, FaShoppingBag, FaClock, FaPlus } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

interface Category {
  id: string;
  name: string;
  isActive?: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'comunes' | 'especiales' | 'populares' | 'bebidas' | 'postres';
  image?: string;
  preparationTime?: number;
  stock?: number;
}

const Menu: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("todas");
  const [cartCount, setCartCount] = useState<number>(2);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories: Category[] = [
    { id: "todas", name: "Todas", isActive: true },
    { id: "comunes", name: "Comunes" },
    { id: "especiales", name: "Especiales" },
    { id: "populares", name: "Populares" },
    { id: "bebidas", name: "Bebidas" },
    { id: "postres", name: "Postres" },
  ];

  // Mock data - replace with API calls later
  const mockMenuItems: MenuItem[] = [
    // Comunes
    { id: "1", name: "Pizza Margherita", price: 35, category: "comunes", preparationTime: 15, stock: 20 },
    { id: "2", name: "Pizza Napolitana", price: 38, category: "comunes", preparationTime: 15, stock: 15 },
    { id: "3", name: "Pizza Muzarella", price: 32, category: "comunes", preparationTime: 12, stock: 25 },
    { id: "4", name: "Pizza Fugazzeta", price: 40, category: "comunes", preparationTime: 18, stock: 12 },
    
    // Especiales
    { id: "5", name: "Pizza Cuatro Quesos", price: 75, category: "especiales", preparationTime: 20, stock: 8 },
    { id: "6", name: "Pizza Calabresa", price: 68, category: "especiales", preparationTime: 22, stock: 10 },
    { id: "7", name: "Pizza Portuguesa", price: 82, category: "especiales", preparationTime: 25, stock: 6 },
    { id: "8", name: "Pizza Especial de la Casa", price: 95, category: "especiales", preparationTime: 28, stock: 5 },
    
    // Populares  
    { id: "9", name: "Pizza BBQ", price: 40, category: "populares", preparationTime: 18, stock: 18 },
    { id: "10", name: "Pizza Pepperoni", price: 60, category: "populares", preparationTime: 16, stock: 22 },
    { id: "11", name: "Pizza Hawaiana", price: 55, category: "populares", preparationTime: 17, stock: 14 },
    { id: "12", name: "Pizza Veggie", price: 48, category: "populares", preparationTime: 15, stock: 16 },
    
    // Bebidas
    { id: "13", name: "Coca Cola 500ml", price: 12, category: "bebidas", stock: 50 },
    { id: "14", name: "Sprite 500ml", price: 12, category: "bebidas", stock: 45 },
    { id: "15", name: "Fanta 500ml", price: 12, category: "bebidas", stock: 40 },
    { id: "16", name: "Agua Mineral 500ml", price: 8, category: "bebidas", stock: 60 },
    { id: "17", name: "Cerveza Quilmes 473ml", price: 18, category: "bebidas", stock: 30 },
    { id: "18", name: "Jugo de Naranja 500ml", price: 15, category: "bebidas", stock: 25 },
    
    // Postres
    { id: "19", name: "Tiramisu", price: 25, category: "postres", preparationTime: 5, stock: 12 },
    { id: "20", name: "Panna Cotta", price: 22, category: "postres", preparationTime: 3, stock: 15 },
    { id: "21", name: "Brownie con Helado", price: 28, category: "postres", preparationTime: 8, stock: 10 },
    { id: "22", name: "Flan Casero", price: 20, category: "postres", preparationTime: 3, stock: 18 },
    { id: "23", name: "Cheesecake", price: 32, category: "postres", preparationTime: 5, stock: 8 },
    { id: "24", name: "Helado Artesanal", price: 18, category: "postres", preparationTime: 2, stock: 20 },
  ];

  useEffect(() => {
    // Simulate API call
    const loadMenuItems = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMenuItems(mockMenuItems);
      setLoading(false);
    };

    loadMenuItems();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleAddToCart = (itemId: string) => {
    setCartCount(prev => prev + 1);
    console.log(`Added item ${itemId} to cart`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNavigate = (section: string) => {
    if (section === "hero") {
      window.location.href = "/";
    } else if (section === "asifunciona" || section === "nosotros") {
      window.location.href = `/#${section}`;
    } else {
      console.log(`Navigate to ${section}`);
    }
  };

  const getFilteredItems = () => {
    let filtered = menuItems;
    
    // Filter by category
    if (activeCategory !== "todas") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getItemsByCategory = () => {
    const filtered = getFilteredItems();
    const categories = ['comunes', 'especiales', 'populares', 'bebidas', 'postres'] as const;
    
    return categories.reduce((acc, category) => {
      const items = filtered.filter(item => item.category === category);
      if (items.length > 0) {
        acc[category] = items;
      }
      return acc;
    }, {} as Record<string, MenuItem[]>);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bebidas':
        return '🥤';
      case 'postres':
        return '🍰';
      default:
        return '🍽️';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      comunes: 'Pizzas Comunes',
      especiales: 'Pizzas Especiales', 
      populares: 'Pizzas Populares',
      bebidas: 'Bebidas',
      postres: 'Postres'
    };
    return names[category as keyof typeof names] || category;
  };

  if (loading) {
    return (
      <div className={styles.productPageDesktop}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Cargando menú...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productPageDesktop}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.menuIcon}>
          <div className={styles.menuIconBg}>
            <div className={styles.menuLines}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className={styles.greeting}>
          Hola Lucas, ¡buenas tardes!
        </div>
        
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.searchBar} 
            placeholder="¿Qué te gustaría comer?"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className={styles.locationInfo}>
          <div>
            <div className={styles.deliverLabel}>Entregar a</div>
            <div className={styles.locationText}>Mendoza, ARG</div>
          </div>
          <div className={styles.cartContainer}>
            <FaShoppingBag className={styles.cartIcon} />
            <div className={styles.cartBadge}>{cartCount}</div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className={styles.categoriesSection}>
        <div className={styles.categoriesTitle}>Todas las categorías</div>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`${styles.categoryCard} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className={styles.categoryBackground}>
                <div className={styles.categoryIcon}>{getCategoryIcon(category.id)}</div>
              </div>
              <div className={styles.categoryLabel}>{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className={styles.contentSection}>
        {activeCategory === "todas" ? (
          // Show all categories with headers
          <div className={styles.sectionsContainer}>
            {Object.entries(getItemsByCategory()).map(([category, items]) => (
              <div key={category} className={styles.menuSection}>
                <div className={styles.sectionTitle}>{getCategoryDisplayName(category)}</div>
                <div className={styles.pizzaGrid}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.pizzaCard}>
                      <div className={styles.pizzaImage}>
                        <span>{getCategoryIcon(item.category)}</span>
                        {item.category === 'bebidas' && (
                          <div className={styles.categoryIconBebida}>🥤</div>
                        )}
                      </div>
                      <div className={styles.pizzaTitle}>{item.name}</div>
                      {item.preparationTime && (
                        <div className={styles.pizzaTime}>
                          <FaClock className={styles.timeIcon} />
                          <span>{item.preparationTime} min</span>
                        </div>
                      )}
                      <div className={styles.stockInfo}>Stock: {item.stock}</div>
                      <div className={styles.pizzaPrice}>${item.price}</div>
                      <button 
                        className={styles.addButton}
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show filtered category
          <div className={styles.menuSection}>
            <div className={styles.sectionTitle}>{getCategoryDisplayName(activeCategory)}</div>
            <div className={styles.pizzaGrid}>
              {getFilteredItems().map((item) => (
                <div key={item.id} className={styles.pizzaCard}>
                  <div className={styles.pizzaImage}>
                    <span>{getCategoryIcon(item.category)}</span>
                    {item.category === 'bebidas' && (
                      <div className={styles.categoryIconBebida}>🥤</div>
                    )}
                  </div>
                  <div className={styles.pizzaTitle}>{item.name}</div>
                  {item.preparationTime && (
                    <div className={styles.pizzaTime}>
                      <FaClock className={styles.timeIcon} />
                      <span>{item.preparationTime} min</span>
                    </div>
                  )}
                  <div className={styles.stockInfo}>Stock: {item.stock}</div>
                  <div className={styles.pizzaPrice}>${item.price}</div>
                  <button 
                    className={styles.addButton}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    <FaPlus />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default Menu;
