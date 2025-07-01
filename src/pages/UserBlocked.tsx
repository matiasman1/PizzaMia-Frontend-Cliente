import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const UserBlocked: React.FC = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          🚫
        </div>
        
        <h1 style={{
          color: '#dc3545',
          marginBottom: '20px',
          fontSize: '28px'
        }}>
          Cuenta Bloqueada
        </h1>
        
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          Tu cuenta ha sido temporalmente bloqueada por motivos de seguridad. 
          Si crees que esto es un error, por favor contacta a nuestro equipo de soporte.
        </p>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#495057',
            fontSize: '16px',
            marginBottom: '10px'
          }}>
            ¿Necesitas ayuda?
          </h3>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: '0'
          }}>
            Contacta a nuestro equipo de soporte:
            <br />
            📧 soporte@pizzamia.com
            <br />
            📱 +54 11 1234-5678
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};