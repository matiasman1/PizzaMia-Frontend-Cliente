import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  const { logout } = useAuth0();
  
  useEffect(() => {
    // Establecer un temporizador para cerrar sesión automáticamente después de 5 segundos
    const timer = setTimeout(() => {
      logout({ logoutParams: { returnTo: window.location.origin } });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [logout]);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f8f8f8',
      fontFamily: 'Sen, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#d32f2f',
          marginBottom: '1rem',
          fontSize: '2rem'
        }}>Acceso Denegado</h1>
        
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          backgroundColor: '#ffebee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem'
        }}>
          🚫
        </div>
        
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.5',
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          Lo sentimos, esta aplicación solo está disponible para usuarios con rol <strong>Cliente</strong>.
        </p>
        
        <p style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Se cerrará tu sesión automáticamente en 5 segundos...
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <button 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
          >
            Cerrar Sesión Ahora
          </button>
          
          <Link 
            to="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;