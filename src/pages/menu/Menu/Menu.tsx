import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import Header from "../Header/Header";
import ItemCard from "../ItemCard/ItemCard";
import CartDrawer from "../modules/SideCarrito/CartDrawer";
import {
  obtenerTodosLosRubros,
  obtenerManufacturadosPorRubro,
  obtenerInsumosNoElaborables,
} from "../../../api/clientApi";
import {
  ArticuloManufacturadoApi,
  InsumoApi,
  RubroApi
} from "../../../types/typesClient";
import { useCartStore } from "../../../store/cartStore";
import { useClienteStore } from '../../../store/clienteStore';

// Definir tipo para los items que mostramos
type MenuItemType = {
  item: ArticuloManufacturadoApi | InsumoApi;
  esManufacturado: boolean;
};

const ITEMS_PER_PAGE = 6;

// Nombres de los rubros que queremos mostrar (sin acento en "Bebidas no alcoholicas")
const RUBROS_A_MOSTRAR = ["Pizzas", "Bebidas no alcoholicas"];

// Valor especial para la opción "Todos"
const TODOS_ID = "todos";

const Menu: React.FC = () => {
  // Estado de la UI
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Usar la store del carrito para el contador
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Estado de los datos
  const [rubros, setRubros] = useState<RubroApi[]>([]);
  const [activeRubro, setActiveRubro] = useState<number | string>(TODOS_ID);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [allItems, setAllItems] = useState<MenuItemType[]>([]);
  const [pizzaItems, setPizzaItems] = useState<MenuItemType[]>([]);
  const [bebidaItems, setBebidaItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Usar el store del cliente
  const cargarCliente = useClienteStore(state => state.cargarCliente);
  
  // Cargar datos del cliente al montar el componente
  useEffect(() => {
    // ID fijo del cliente mientras no hay autenticación
    const clienteIdFijo = 1;
    cargarCliente(clienteIdFijo).catch(error => {
      console.error("Error al cargar datos del cliente:", error);
    });
  }, [cargarCliente]);
  
  // Cargar rubros al inicio
  useEffect(() => {
    const loadRubros = async () => {
      try {
        setLoading(true);
        const data = await obtenerTodosLosRubros();
        
        // Filtrar solo los rubros específicos
        const rubrosFiltered = data.filter(rubro => 
          RUBROS_A_MOSTRAR.includes(rubro.denominacion)
        );
        
        console.log("Rubros encontrados:", rubrosFiltered);
        setRubros(rubrosFiltered);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
        setRubros([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRubros();
  }, []);
  
  // Cargar datos para cada rubro específicamente
  useEffect(() => {
    if (rubros.length === 0) return;
    
    const loadAllItems = async () => {
      setLoading(true);
      try {
        console.log("Cargando productos para todos los rubros...");
        
        // Encontrar ID del rubro "Pizzas"
        const pizzaRubro = rubros.find(r => r.denominacion === "Pizzas");
        // Encontrar ID del rubro "Bebidas no alcoholicas"
        const bebidaRubro = rubros.find(r => r.denominacion === "Bebidas no alcoholicas");
        
        console.log("ID Rubro Pizzas:", pizzaRubro?.id);
        console.log("ID Rubro Bebidas:", bebidaRubro?.id);
        
        // Cargar productos para cada rubro
        let pizzas: MenuItemType[] = [];
        let bebidas: MenuItemType[] = [];
        
        if (pizzaRubro) {
          // Cargar pizzas (manufacturados)
          const pizzasRes = await obtenerManufacturadosPorRubro(
            pizzaRubro.id as number, 
            0, 
            12, 
            "denominacion"
          );
          
          pizzas = pizzasRes.content.map(item => ({ 
            item, 
            esManufacturado: true 
          }));
          
          console.log("Pizzas cargadas:", pizzas.length);
        }
        
        if (bebidaRubro) {
          // Cargar bebidas (insumos)
          const bebidasRes = await obtenerInsumosNoElaborables(
            0, 
            12, 
            "denominacion", 
            bebidaRubro.id as number
          );
          
          bebidas = bebidasRes.content.map(item => ({ 
            item, 
            esManufacturado: false 
          }));
          
          console.log("Bebidas cargadas:", bebidas.length);
        }
        
        // Guardar por separado para la vista "Todos"
        setPizzaItems(pizzas);
        setBebidaItems(bebidas);
        
        // Combinar todos los items
        const combined = [...pizzas, ...bebidas];
        setAllItems(combined);
        
        // Si estamos en la vista "Todos", actualizar los items mostrados
        if (activeRubro === TODOS_ID) {
          setMenuItems(combined);
        }
        
      } catch (error) {
        console.error("Error al cargar productos para todos los rubros:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllItems();
  }, [rubros]);
  
  // Cargar items cuando cambia el rubro o la página
  useEffect(() => {
    // Si es "Todos", usar los items ya cargados
    if (activeRubro === TODOS_ID) {
      setMenuItems(allItems);
      return;
    }
    
    // Si no es un número, no hacer nada
    if (typeof activeRubro !== 'number') return;
    
    const loadItemsByRubro = async () => {
      try {
        setLoading(true);
        
        // Determinar si este rubro es de pizzas o bebidas
        const esRubroPizzas = rubros.find(r => r.id === activeRubro)?.denominacion === "Pizzas";
        
        if (esRubroPizzas) {
          // Cargar manufacturados (pizzas)
          const manuRes = await obtenerManufacturadosPorRubro(
            activeRubro, 
            currentPage, 
            ITEMS_PER_PAGE, 
            "denominacion"
          );
          
          setMenuItems(manuRes.content.map(item => ({ 
            item, 
            esManufacturado: true 
          })));
          setTotalPages(manuRes.totalPages);
        } else {
          // Cargar insumos (bebidas)
          const insuRes = await obtenerInsumosNoElaborables(
            currentPage, 
            ITEMS_PER_PAGE, 
            "denominacion", 
            activeRubro
          );
          
          setMenuItems(insuRes.content.map(item => ({ 
            item, 
            esManufacturado: false 
          })));
          setTotalPages(insuRes.totalPages);
        }
      } catch (error) {
        console.error("Error al cargar productos por rubro:", error);
        setMenuItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    loadItemsByRubro();
  }, [activeRubro, currentPage, rubros]);
  
  // Resetear página cuando cambia el rubro
  useEffect(() => {
    setCurrentPage(0);
  }, [activeRubro]);
  
  // Filtrado por búsqueda
  const getFilteredItems = (items: MenuItemType[]) => {
    if (!searchQuery.trim()) return items;
    
    return items.filter(({ item }) => 
      item.denominacion.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Filtrar los items según la búsqueda para cada sección
  const filteredMenuItems = getFilteredItems(menuItems);
  const filteredPizzaItems = getFilteredItems(pizzaItems);
  const filteredBebidaItems = getFilteredItems(bebidaItems);

  return (
    <div className={styles.productPageDesktop}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Drawer del carrito */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Contenido principal con margen superior */}
      <div className={styles.mainContent}>
        {/* Sección de Categorías */}
        <div className={styles.categoriesSection}>
          <div className={styles.categoriesTitle}>Categorías</div>
          <div className={styles.categoriesGrid}>
            {/* Opción "Todos" */}
            <div
              className={`${styles.categoryCard} ${activeRubro === TODOS_ID ? styles.active : ""}`}
              onClick={() => setActiveRubro(TODOS_ID)}
            >
              <div className={styles.categoryBackground}>
                <div className={styles.categoryIcon}>🍽️</div>
              </div>
              <div className={styles.categoryLabel}>Todos</div>
            </div>
            
            {/* Rubros específicos */}
            {rubros.map((rubro) => (
              <div
                key={rubro.id}
                className={`${styles.categoryCard} ${activeRubro === rubro.id ? styles.active : ""}`}
                onClick={() => setActiveRubro(rubro.id as number)}
              >
                <div className={styles.categoryBackground}>
                  <div className={styles.categoryIcon}>
                    {rubro.denominacion === "Pizzas" ? "🍕" : "🥤"}
                  </div>
                </div>
                <div className={styles.categoryLabel}>{rubro.denominacion}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className={styles.contentSection}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingText}>Cargando...</div>
            </div>
          ) : activeRubro === TODOS_ID ? (
            // Vista "Todos": mostrar secciones de Pizzas y Bebidas
            <div className={styles.allItemsContainer}>
              {/* Sección Pizzas */}
              {filteredPizzaItems.length > 0 && (
                <div className={styles.menuSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Pizzas</div>
                    {filteredPizzaItems.length > 6 && (
                      <button 
                        className={styles.verMasButton}
                        onClick={() => {
                          const pizzaRubro = rubros.find(r => r.denominacion === "Pizzas");
                          if (pizzaRubro) setActiveRubro(pizzaRubro.id as number);
                        }}
                      >
                        Ver más
                      </button>
                    )}
                  </div>
                  <div className={styles.pizzaGrid}>
                    {filteredPizzaItems.slice(0, 6).map(({ item, esManufacturado }) => (
                      <ItemCard
                        key={`${esManufacturado ? "m" : "i"}-${item.id}`}
                        item={item}
                        esManufacturado={esManufacturado}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sección Bebidas */}
              {filteredBebidaItems.length > 0 && (
                <div className={styles.menuSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Bebidas no alcoholicas</div>
                    {filteredBebidaItems.length > 6 && (
                      <button 
                        className={styles.verMasButton}
                        onClick={() => {
                          const bebidaRubro = rubros.find(r => r.denominacion === "Bebidas no alcoholicas");
                          if (bebidaRubro) setActiveRubro(bebidaRubro.id as number);
                        }}
                      >
                        Ver más
                      </button>
                    )}
                  </div>
                  <div className={styles.pizzaGrid}>
                    {filteredBebidaItems.slice(0, 6).map(({ item, esManufacturado }) => (
                      <ItemCard
                        key={`${esManufacturado ? "m" : "i"}-${item.id}`}
                        item={item}
                        esManufacturado={esManufacturado}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Mensaje si no hay items que coincidan con la búsqueda */}
              {filteredPizzaItems.length === 0 && filteredBebidaItems.length === 0 && (
                <div className={styles.emptyState}>
                  {searchQuery.trim() 
                    ? `No se encontraron productos que coincidan con "${searchQuery}".` 
                    : "No se encontraron productos en las categorías seleccionadas."}
                </div>
              )}
            </div>
          ) : filteredMenuItems.length > 0 ? (
            // Vista de un rubro específico con paginación
            <div className={styles.menuSection}>
              <div className={styles.sectionTitle}>
                {typeof activeRubro === 'number' 
                  ? rubros.find(r => r.id === activeRubro)?.denominacion 
                  : "Productos"}
              </div>
              
              <div className={styles.pizzaGrid}>
                {filteredMenuItems.map(({ item, esManufacturado }) => (
                  <ItemCard
                    key={`${esManufacturado ? "m" : "i"}-${item.id}`}
                    item={item}
                    esManufacturado={esManufacturado}
                  />
                ))}
              </div>
              
              {/* Paginación (solo para rubros específicos) */}
              <div className={styles.pagination}>
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              {searchQuery.trim() 
                ? `No se encontraron productos que coincidan con "${searchQuery}".` 
                : "No hay productos disponibles para esta categoría."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;