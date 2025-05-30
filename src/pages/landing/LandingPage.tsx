import React from "react";
import styles from "./LandingPage.module.css";
import pizzaIcon from "../../assets/pizza-icon.svg";
import facebookIcon from "../../assets/facebook-icon.svg";
import instagramIcon from "../../assets/instagram-icon.svg";
import twitterIcon from "../../assets/twitter-icon.svg";
import { FaArrowRight } from "react-icons/fa";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPageDesktop}>
      {/* NavBar Section */}
      <div className={styles.navbarSections}>
        <div className={styles.navbarRect}></div>
        <div className={styles.navLinks}>
          <div className={styles.homeLink}>Home</div>
          <div className={styles.functionLink}>Así funciona</div>
          <div className={styles.menuLink}>Menú</div>
          <div className={styles.aboutLink}>Nosotros</div>
          <div className={styles.contactLink}>Contacto</div>
          <div className={styles.navIndicator}></div>
        </div>
        <div className={styles.brandLogo}>
          <div className={styles.pizzaMia}>Pizza Mía</div>
          <div className={styles.pizzaOutlineContainer}>
            <img src={pizzaIcon} alt="Pizza Icon" className={styles.pizzaOutline} />
          </div>
        </div>
        <button className={styles.orderNowButton}>
          <div className={styles.orderNowText}>ORDENA AHORA</div>
        </button>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSections}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Tu próxima <span className={styles.accentText}>pizza</span> favorita está a un click de distancia
          </h1>
          <p className={styles.heroDescription}></p>
            No esperes más. Tu pizza perfecta está saliendo del horno antes de que termines de decidir.
          </p>
          <button className={styles.startButton}>
            <div className={styles.startButtonText}>EMPEZAR</div>
          </button>
        </div>
      </div>

      {/* Así Funciona Section */}
      <div className={styles.asiFuncionaSections}>
        <h3 className={styles.sectionTag}>Asi funciona</h3>
        <h2 className={styles.sectionTitle}>Qué ofrecemos</h2>
        <p className={styles.sectionDescription}>
          La calidad del producto es nuestra prioridad, y siempre garantizamos que sea fresco y seguro hasta que llegue a tus manos.
        </p>
        
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Fácil de pedir</h3>
            <p className={styles.featureDescription}>
              Solo tenés que hacer tu pedido a través del sitio web.
            </p>
          </div>
          
          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Entrega rápida</h3>
            <p className={styles.featureDescription}>
              Tu pedido llegará a tiempo.
            </p>
          </div>
          
          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>La mejor calidad</h3>
            <p className={styles.featureDescription}>
              La mejor calidad de comida para vos.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className={styles.menuSections}>
        {/* Favoritas Section */}
        <div className={styles.favoritasSections}>
          <h3 className={styles.sectionTag}>Nuestro menú</h3>
          <h2 className={styles.sectionTitle}>Nuestras pizzas favoritas</h2>
          <p className={styles.sectionDescription}>
            Las que vuelan primero. Son las favoritas de todos, y no duran mucho. ¿Probaste la tuya?
          </p>
          
          <div className={styles.productGrid}>
            <div className={styles.productCard}>
              <div className={styles.productImage}></div>
              <h3 className={styles.productName}>Clásica Margherita</h3>
              <div className={styles.productPrice}>$35.00</div>
              <div className={styles.cartIcon}></div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productImage}></div>
              <h3 className={styles.productName}>Peperoni Power</h3>
              <div className={styles.productPrice}>$35.00</div>
              <div className={styles.cartIcon}></div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productImage}></div>
              <h3 className={styles.productName}>La Fugazzeta</h3>
              <div className={styles.productPrice}>$35.00</div>
              <div className={styles.cartIcon}></div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productImage}></div>
              <h3 className={styles.productName}>La Fugazzeta</h3>
              <div className={styles.productPrice}>$35.00</div>
              <div className={styles.cartIcon}></div>
            </div>
          </div>
          
          <div className={styles.navigation}>
            <div className={styles.leftSidebar}></div>
            <div className={styles.rightSidebar}></div>
            <button className={styles.exploreButton}>
              <div className={styles.explorarMenu}>EXPLORAR MENÚ</div>
            </button>
          </div>
        </div>

        {/* Promoción Section */}
        <div className={styles.promocionSections}>
          <h2 className={styles.sectionTitle}>El sabor también está en oferta</h2>
          <p className={styles.sectionDescription}>
            Aprovechá nuestras ofertas especiales y llevate tu pizza favorita a un precio que te va a hacer sonreír (y repetir).
          </p>
          
          <div className={styles.promoCard}>
            <div className={styles.promoContent}>
              <h3 className={styles.promoType}>Combo de pizza + bebida</h3>
              <h2 className={styles.promoTitle}>¡Promoción <br/>Especial!</h2>
              <p className={styles.promoDescription}>Solo por tiempo limitado</p>
              <button className={styles.exploreButton}>
                <div className={styles.explorarMenu}>EXPLORAR MENÚ</div>
              </button>
            </div>
          </div>
          
          <div className={styles.pagination}>
            <div className={styles.paginationPrev}></div>
            <div className={styles.paginationNext}></div>
          </div>
        </div>
      </div>

      {/* Nosotros Section */}
      <div className={styles.nosotrosSections}>
        <h3 className={styles.sectionTag}>Nosotros</h3>
        <h2 className={styles.sectionTitle}>Dónde encontrarnos y cuándo visitarnos</h2>
        
        <div className={styles.infoCards}>
          <div className={styles.locationCard}>
            <div className={styles.locationIcon}></div>
            <h3 className={styles.locationTitle}>Dirección</h3>
            <p className={styles.locationAddress}>
              Av. Juan B. Justo 2875, <br/>
              Edificio Torre Norte, Local 5B, <br/>
              Godoy Cruz, Mendoza
            </p>
          </div>
          
          <div className={styles.hoursCard}>
            <div className={styles.hoursIcon}></div>
            <h3 className={styles.hoursTitle}>Horarios de atención</h3>
            <p className={styles.hoursText}>
              <strong>Lunes a Sábado:</strong> 12:00 p.m. – 11:00 p.m. <br/>
              <strong>Domingos:</strong> 5:00 p.m. – 10:00 p.m.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footerSections}>
        <div className={styles.footerContent}>
          <div className={styles.brandSection}>
            <div className={styles.pizzaMia}>Pizza Mía</div>
            <div className={styles.food2}>
              <div className={styles.pizzaOutline}>
                <img src={pizzaIcon} alt="Pizza Icon" width="56" height="58" />
              </div>
            </div>
            <div className={styles.socialIcons}>
              <img src={facebookIcon} alt="Facebook Icon" className={styles.socialIcon} />
              <img src={instagramIcon} alt="Instagram Icon" className={styles.socialIcon} />
              <img src={twitterIcon} alt="Twitter Icon" className={styles.socialIcon} />
            </div>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.enlacesRapidos}>Enlaces rápidos</div>
            <div className={styles.home}>Home</div>
            <div className={styles.asiFunciona}>Así funciona</div>
            <div className={styles.menu}>Menú</div>
            <div className={styles.nostros}>Nostros</div>
          </div>

          <div className={styles.contactSection}>
            <div className={styles.ponteEnContacto}>Ponte en contacto</div>
            <div className={styles.phone}>+62 896 7311 2766</div>
            <div className={styles.email}>PizzaMía@example.com</div>
          </div>
        </div>
        
        <div className={styles.footerDivider}></div>
        <div className={styles.copyright}>© 2025 PizzaMía. ALL RIGHT RESERVED.</div>
      </div>
    </div>
  );
};

export default LandingPage;