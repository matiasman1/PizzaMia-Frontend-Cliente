import React, { useState, useRef, useEffect } from "react";
import styles from "./LandingPage.module.css";
// Import components
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/UI/Button/Button";

// Import icons and images
import heroMainImg from "../../assets/landing/Lovepik_com-400595226-pizza 1.svg";
import heroSideImg1 from "../../assets/landing/image 13.svg";
import heroSideImg2 from "../../assets/landing/image 14.svg";
import easyToOrderImg from "../../assets/landing/order 1.svg";
import fastDeliveryImg from "../../assets/landing/delivery 1.svg";
import bestQualityImg from "../../assets/landing/courier 1.svg";
import pizzaMargherita from "../../assets/landing/pizza-margherita.svg";
import pizzaPepperoni from "../../assets/landing/pizza-pepperoni.svg";
import pizzaFugazzeta from "../../assets/landing/pizza-fugazzetta.svg";
import pizzaStromboli from "../../assets/landing/pizza-stromboli.png";
import promoCokePizza from "../../assets/landing/promo-coke-pizza.svg";
import { FaChevronLeft, FaChevronRight, FaShoppingBag, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [carouselPosition, setCarouselPosition] = useState<number>(0);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    asifunciona: useRef<HTMLDivElement>(null),
    menu: useRef<HTMLDivElement>(null),
    nosotros: useRef<HTMLDivElement>(null),
    footer: useRef<HTMLDivElement>(null),
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Adding offset for header

      // Find which section is in view
      for (const section of Object.keys(sectionRefs).reverse()) {
        const ref = sectionRefs[section as keyof typeof sectionRefs];
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section with smooth animation
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs].current;
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 86, // Adjust for navbar height
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Move pizza carousel
  const moveCarousel = (direction: number) => {
    if (!carouselTrackRef.current) return;
    
    const trackWidth = carouselTrackRef.current.scrollWidth;
    const containerWidth = carouselTrackRef.current.parentElement?.clientWidth || 0;
    const maxPosition = trackWidth - containerWidth;
    
    let newPosition = carouselPosition - (direction * 360);
    
    // Prevent scrolling too far
    if (newPosition > 0) newPosition = 0;
    if (newPosition < -maxPosition) newPosition = -maxPosition;
    
    setCarouselPosition(newPosition);
  };

  return (
    <div className={styles.landingPageDesktop}>
      {/* Header component */}
      <Header activeSection={activeSection} onNavClick={scrollToSection} />

      {/* Hero Section */}
      <div ref={sectionRefs.hero} className={styles.heroSections}>
        <div className={styles.content}>
          <h1 className={styles.heroTitle}>
            Tu próxima <span className={styles.accentText}>pizza</span> favorita está a un click de distancia
          </h1>
          <p className={styles.heroDescription}>
            No esperes más. Tu pizza perfecta está saliendo del horno antes de que termines de decidir.
          </p>
          <Button text="EMPEZAR" onClick={() => console.log('Start clicked')} />
        </div>
        <div className={styles.images}>
          <img src={heroMainImg} className={styles.heroMainImg} alt="Pizza" />
          <img src={heroSideImg1} className={styles.heroSideImg1} alt="Pizza" />
          <img src={heroSideImg2} className={styles.heroSideImg2} alt="Pizza" />
        </div>
      </div>

      {/* Así Funciona Section */}
      <div ref={sectionRefs.asifunciona} className={styles.asiFuncionaSections}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTag}>Asi funciona</h3>
          <h2 className={styles.sectionTitle}>Qué ofrecemos</h2>
          <p className={styles.sectionDescription}>
            La calidad del producto es nuestra prioridad, y siempre garantizamos que sea fresco y seguro hasta que llegue a tus manos.
          </p>
        </div>
        
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <div className={styles.featureImage}>
              <img src={easyToOrderImg} alt="Fácil de pedir" />
            </div>
            <h3 className={styles.featureTitle}>Fácil de pedir</h3>
            <p className={styles.featureDescription}>
              Solo tenés que hacer tu pedido a través del sitio web.
            </p>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureImage}>
              <img src={fastDeliveryImg} alt="Entrega rápida" />
            </div>
            <h3 className={styles.featureTitle}>Entrega rápida</h3>
            <p className={styles.featureDescription}>
              Tu pedido llegará a tiempo.
            </p>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureImage}>
              <img src={bestQualityImg} alt="La mejor calidad" />
            </div>
            <h3 className={styles.featureTitle}>La mejor calidad</h3>
            <p className={styles.featureDescription}>
              La mejor calidad de comida para vos.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div ref={sectionRefs.menu} className={styles.menuSections}>
        {/* Favorite pizzas section */}
        <div className={styles.favoritasSections}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTag}>Nuestro menú</h3>
            <h2 className={styles.sectionTitle}>Nuestras pizzas favoritas</h2>
            <p className={styles.sectionDescription}>
              Las que vuelan primero. Son las favoritas de todos, y no duran mucho. ¿Probaste la tuya?
            </p>
          </div>
          
          <div className={styles.carouselContainer}>
            <button className={`${styles.carouselButton} ${styles.left}`} onClick={() => moveCarousel(-1)}>
              <FaChevronLeft />
            </button>
            
            <div 
              className={styles.carouselTrack} 
              ref={carouselTrackRef}
              style={{transform: `translateX(${carouselPosition}px)`}}
            >
              <div className={styles.pizzaCard}>
                <div className={styles.pizzaImage}>
                  <img src={pizzaMargherita} alt="Pizza Margherita" />
                </div>
                <h3 className={styles.pizzaTitle}>Clásica Margherita</h3>
                <p className={styles.pizzaPrice}>$35.00</p>
                <div className={styles.cartIcon}>
                  <FaShoppingBag />
                </div>
              </div>
              
              <div className={styles.pizzaCard}>
                <div className={styles.pizzaImage}>
                  <img src={pizzaPepperoni} alt="Pepperoni Power" />
                </div>
                <h3 className={styles.pizzaTitle}>Peperoni Power</h3>
                <p className={styles.pizzaPrice}>$35.00</p>
                <div className={styles.cartIcon}>
                  <FaShoppingBag />
                </div>
              </div>
              
              <div className={styles.pizzaCard}>
                <div className={styles.pizzaImage}>
                  <img src={pizzaFugazzeta} alt="La Fugazzeta" />
                </div>
                <h3 className={styles.pizzaTitle}>La Fugazzeta</h3>
                <p className={styles.pizzaPrice}>$35.00</p>
                <div className={styles.cartIcon}>
                  <FaShoppingBag />
                </div>
              </div>
              
              <div className={styles.pizzaCard}>
                <div className={styles.pizzaImage}>
                  <img src={pizzaFugazzeta} alt="La Fugazzeta Rellena" />
                </div>
                <h3 className={styles.pizzaTitle}>La Fugazzeta Rellena</h3>
                <p className={styles.pizzaPrice}>$35.00</p>
                <div className={styles.cartIcon}>
                  <FaShoppingBag />
                </div>
              </div>
              
              <div className={styles.pizzaCard}>
                <div className={styles.pizzaImage}>
                  <img src={pizzaStromboli} alt="Stromboli Deluxe" />
                </div>
                <h3 className={styles.pizzaTitle}>Stromboli Deluxe</h3>
                <p className={styles.pizzaPrice}>$40.00</p>
                <div className={styles.cartIcon}>
                  <FaShoppingBag />
                </div>
              </div>
            </div>
            
            <button className={`${styles.carouselButton} ${styles.right}`} onClick={() => moveCarousel(1)}>
              <FaChevronRight />
            </button>
          </div>
          
          <Button text="EXPLORAR MENÚ" onClick={() => console.log('Explore menu clicked')} />
        </div>

        {/* Promocion section */}
        <div className={styles.promocionSections}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>El sabor también está en oferta</h2>
            <p className={styles.sectionDescription}>
              Aprovechá nuestras ofertas especiales y llevate tu pizza favorita a un precio que te va a hacer sonreír (y repetir).
            </p>
          </div>
          
          <div className={styles.promoContainer}>
            <div className={styles.promoContent}>
              <h3 className={styles.promoCategory}>Combo de pizza + bebida</h3>
              <h2 className={styles.promoTitle}>¡Promoción <br/>Especial!</h2>
              <p className={styles.promoTime}>Solo por tiempo limitado</p>
              <Button text="EXPLORAR MENÚ" onClick={() => console.log('Explore menu clicked')} />
            </div>
            <div className={styles.promoImage}>
              <img src={promoCokePizza} alt="Promoción Especial" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Nosotros Section */}
      <div ref={sectionRefs.nosotros} className={styles.nosotrosSections}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTag}>Nosotros</h3>
          <h2 className={styles.sectionTitle}>Dónde encontrarnos y cuándo visitarnos</h2>
        </div>
        
        <div className={styles.mapContainer}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6699.354174374493!2d-68.86481309999999!3d-32.9067049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09a204f7b963%3A0xead55ce83321ea9f!2sJuan%20B.%20Justo%202875%2C%20M5504IJV%20Godoy%20Cruz%2C%20Mendoza!5e0!3m2!1ses-419!2sar!4v1748621617619!5m2!1ses-419!2sar" 
            title="Ubicación Pizza Mía"
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
        <div className={styles.nosotrosInfo}>
          <div className={styles.locationInfo}>
            <div className={styles.infoHeader}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <h3 className={styles.infoTitle}>Dirección</h3>
            </div>
            <p className={styles.infoText}>
              Av. Juan B. Justo 2875, <br/>
              Edificio Torre Norte, Local 5B, <br/>
              Godoy Cruz, Mendoza
            </p>
          </div>
          
          <div className={styles.hoursInfo}>
            <div className={styles.infoHeader}>
              <FaClock className={styles.infoIcon} />
              <h3 className={styles.infoTitle}>Horarios de atención</h3>
            </div>
            <p className={styles.infoText}>
              <strong>Lunes a Sábado:</strong> 12:00 p.m. – 11:00 p.m. <br/>
              <strong>Domingos:</strong> 5:00 p.m. – 10:00 p.m.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section with component */}
      <div ref={sectionRefs.footer}>
        <Footer onNavigate={scrollToSection} />
      </div>
    </div>
  );
};

export default LandingPage;