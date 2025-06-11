import React from "react";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className={styles.footerSections}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.footerBrandHeader}>
            <h2 className={styles.pizzaMia}>Pizza Mía</h2>
            <div className={styles.foodIcon}>
              <svg width="47" height="47" viewBox="0 0 56 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_154_240)">
                <path d="M46.8942 20.9108C43.7559 17.7079 39.5224 14.5888 34.828 12.4987C30.1337 10.4086 25.0955 9.28575 20.5121 9.11217C20.1064 9.09987 19.3191 9.13765 19.2528 9.76115L19.1753 11.8409C19.2008 12.5711 19.5425 12.7232 20.0099 12.9313C20.1409 12.9896 20.3563 12.9979 20.6135 13.009C24.9796 13.2204 29.2688 14.2379 33.2646 16.0101C37.4169 17.8589 41.28 20.6307 43.963 23.4031C44.1801 23.6224 44.301 23.7446 44.4246 23.7997C44.906 24.014 45.1126 24.298 45.7858 23.6957L47.2848 22.2523C47.6272 21.8789 47.2722 21.2983 46.8942 20.9108Z" stroke="#FF7622" strokeWidth="2.5625" strokeMiterlimit="10"/>
                <path d="M42.2464 25.2205C39.4683 22.3269 36.1736 20.1429 32.2459 18.3942C28.3182 16.6455 24.191 15.5969 20.4841 15.4962C19.7855 15.4745 19.0746 15.6576 19.1123 16.5948C19.1425 17.3559 19.2814 37.0782 19.504 44.1898C19.5112 44.4299 19.586 44.6631 19.7199 44.8626C19.8538 45.0621 20.0412 45.2197 20.2606 45.3174C20.4801 45.4151 20.7227 45.4489 20.9605 45.4149C21.1983 45.3809 21.4217 45.2805 21.605 45.1252L42.3122 26.9766C42.7703 26.5757 42.8796 25.8793 42.2464 25.2205Z" stroke="#FF7622" strokeWidth="2.5625" strokeMiterlimit="10"/>
                <path d="M23.9602 24.3083C25.2531 24.8839 26.8009 24.2282 27.4173 22.8436C28.0338 21.4591 27.4854 19.8701 26.1925 19.2945C24.8996 18.7188 23.3518 19.3746 22.7354 20.7591C22.119 22.1437 22.6673 23.7327 23.9602 24.3083Z" fill="#FF7622"/>
                <path d="M32.7659 29.7304C34.0588 30.3061 35.6066 29.6503 36.223 28.2658C36.8394 26.8812 36.2911 25.2922 34.9982 24.7166C33.7053 24.141 32.1575 24.7967 31.5411 26.1812C30.9246 27.5658 31.473 29.1548 32.7659 29.7304Z" fill="#FF7622"/>
                <path d="M24.178 36.4209C25.4709 36.9965 27.0187 36.3407 27.6351 34.9562C28.2515 33.5717 27.7032 31.9826 26.4103 31.407C25.1174 30.8314 23.5696 31.4871 22.9532 32.8717C22.3367 34.2562 22.8851 35.8452 24.178 36.4209Z" fill="#FF7622"/>
                </g>
                <defs>
                <clipPath id="clip0_154_240">
                <rect width="41" height="43.9067" fill="white" transform="translate(17.7275 0.506348) rotate(24)"/>
                </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className={styles.socialIcons}>
            <a href="https://instagram.com/pizzamia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.socialIcon}><FaInstagram /></div>
            </a>
            <a href="https://facebook.com/pizzamia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.socialIcon}><FaFacebook /></div>
            </a>
            <a href="https://twitter.com/pizzamia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.socialIcon}><FaTwitter /></div>
            </a>
          </div>
        </div>
        
        <div className={styles.footerLinks}>
          <h3 className={styles.footerSectionTitle}>Enlaces rápidos</h3>
          <p className={styles.footerLink} onClick={() => onNavigate("hero")}>Home</p>
          <p className={styles.footerLink} onClick={() => onNavigate("asifunciona")}>Así funciona</p>
          <p className={styles.footerLink} onClick={() => onNavigate("menu")}>Menú</p>
          <p className={styles.footerLink} onClick={() => onNavigate("nosotros")}>Nosotros</p>
        </div>
        
        <div className={styles.footerContact}>
          <h3 className={styles.footerSectionTitle}>Ponte en contacto</h3>
          <p className={styles.contactInfo}>+62 896 7311 2766</p>
          <a 
            href="mailto:PizzaMía@example.com" 
            className={styles.emailLink}
          >
            PizzaMía@example.com
          </a>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© 2025 PizzaMía. ALL RIGHT RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;
