```markdown
# Frontend - Proyecto "Pizza Mia"

## 🏢 Descripción General

El proyecto "Pizza Mia" consiste en el desarrollo de una aplicación frontend utilizando React + TypeScript + Vite, que incluye:

-   Una landing page de acceso público.
-   Un sistema de ecommerce para clientes.
-   Un panel de administración exclusivo para el administrador.

Cada una de estas tres áreas tiene sus propios componentes y vistas. No se comparten componentes reutilizables entre cliente, administrador o landing.

## 📁 Estructura de Carpetas Actualizada

```
pizza-mia-frontend/
├── public/
├── src/
│   ├── assets/                 # Imágenes, logos, fuentes, etc.
│   │   ├── admin/              # Assets específicos para el panel de administrador
│   │   ├── client/             # Assets específicos para el portal del cliente
│   │   │   ├── current-location.svg
│   │   │   ├── disabled-location.svg
│   │   │   ├── filter-icon.svg
│   │   │   ├── marked-location.svg
│   │   │   ├── order-icon.svg
│   │   │   ├── paymentmode-cash.svg
│   │   │   ├── paymentmode-MP.svg
│   │   │   ├── pizza-bbq.png
│   │   │   ├── pizza-pepperoni.png
│   │   │   └── unmarked-location.svg
│   │   └── landing/            # Assets específicos para la landing page
│   ├── components/             # Componentes divididos por dominio
│   │   ├── Admin/              # Componentes reutilizables exclusivos del administrador
│   │   ├── Client/             # Componentes reutilizables exclusivos del cliente
│   │   │   ├── ProfileLayout/  # Layout para las páginas de perfil de usuario
│   │   │   │   ├── ProfileLayout.tsx
│   │   │   │   └── ProfileLayout.module.css
│   │   │   └── SideBar/        # Barra lateral para el portal del cliente
│   │   │       ├── SideBar.tsx
│   │   │       └── SideBar.module.css
│   │   ├── Landing/            # Componentes reutilizables exclusivos de la landing
│   │   └── Global/             # Componentes compartidos generales (si los hubiera)
│   ├── layouts/                # Layouts compartidos entre vistas
│   ├── routes/                 # Definiciones de rutas (React Router)
│   │   └── AppRoutes.tsx       # Configuración principal de rutas
│   ├── services/               # Servicios y llamadas HTTP a APIs
│   ├── types/                  # Tipos e interfaces TypeScript globales
│   ├── utils/                  # Funciones utilitarias
│   ├── styles/                 # Estilos globales y específicos por dominio
│   │   ├── base/               # Reset, tipografías, estilos globales
│   │   │   └── admin-variables.css
│   │   │   └── client-variables.css
│   │   ├── themes/             # Estilos específicos por dominio
│   │   │   ├── landing.css
│   │   │   ├── client.css
│   │   │   └── admin.css
│   │   ├── variables.css       # Variables CSS globales (colores, fuentes, etc.)
│   │   └── index.css           # Entrada principal de estilos globales
│   ├── pages/
│   │   ├── landing/
│   │   │   └── LandingPage.tsx # Página principal de acceso público
│   │   ├── client/
│   │   │   ├── ClientPage.tsx  # Contenedor principal del portal cliente
│   │   │   └── modules/        # Módulos específicos del cliente
│   │   │       ├── profile/    # Módulo de perfil de usuario
│   │   │       │   ├── PersonalInfo.tsx          # Información personal
│   │   │       │   ├── PersonalInfo.module.css
│   │   │       │   ├── Addresses.tsx             # Gestión de direcciones
│   │   │       │   ├── Addresses.module.css
│   │   │       │   ├── Orders.tsx                # Historial de pedidos
│   │   │       │   ├── Orders.module.css
│   │   │       │   ├── Cart.tsx                  # Carrito de compras
│   │   │       │   └── Cart.module.css
│   │   └── admin/
│   │       ├── AdminPage.tsx   # Contenedor principal del panel admin
│   │       ├── LoginAdmin/     # Página de login para administradores
│   │       └── modules/        # Vistas por sección del panel admin
│   │           └── Estadisticas/    # Módulo de estadísticas
│   │               ├── EstadisticasSection.tsx
│   │               └── EstadisticasSection.module.css
│   ├── contexts/               # Context API (Auth, carrito, etc.)
│   ├── hooks/                  # Custom hooks (useAuth, useCart, etc.)
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Punto de entrada de la aplicación
├── index.html                  # Archivo HTML principal con fuentes importadas
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔄 Rutas Principales Actualizadas

-   `/` ➜ Landing page
-   `/client/*` ➜ Portal de clientes
    - `/client/profile/personal-info` ➜ Información personal del usuario
    - `/client/profile/addresses` ➜ Gestión de direcciones del usuario
    - `/client/orders` ➜ Historial de pedidos realizados
    - `/client/cart` ➜ Carrito de compras
-   `/admin/*` ➜ Portal de administradores
    - `/admin/login` ➜ Inicio de sesión para administradores

## 🧩 Funcionalidades Implementadas

### Portal Cliente
- **Perfil de Usuario**: Visualización y edición de información personal
- **Gestión de Direcciones**: Añadir, editar y eliminar direcciones de entrega
- **Historial de Pedidos**: Visualización de pedidos realizados con detalles y estado
- **Carrito de Compras**: Gestión de productos seleccionados y proceso de compra
  - Selección de método de pago (Efectivo/MercadoPago)
  - Selección de dirección de entrega
  - Visualización de resumen de compra

## 📦 Dependencias Instaladas

Estas son las principales dependencias utilizadas en el proyecto:

```bash
npm install react-router-dom
npm install react-icons
npm install chart.js react-chartjs-2
npm install xlsx
npm install file-saver
npm install --save-dev @types/file-saver
npm install exceljs 
npm install html2canvas
```

-   **react-router-dom**: para el manejo de rutas en la SPA.
-   **react-icons**: para incluir iconos como FaPlus, FaMinus y FaTimes.
-   **chart.js y react-chartjs-2**: para visualización de gráficos estadísticos.
-   **xlsx, file-saver y exceljs**: para manejo y exportación de datos a Excel.
-   **html2canvas**: para capturar y exportar elementos HTML como imágenes.

## 🌐 Repositorio del Proyecto

Repositorio oficial de este frontend: https://github.com/Lucas-Chavez/pizza-mia-frontend.git

## 📥 Clonación del proyecto

Para clonar el repositorio en tu máquina local:

```bash
git clone https://github.com/Lucas-Chavez/pizza-mia-frontend.git
cd pizza-mia-frontend
npm install
npm run dev
```

Nombre del archivo raíz del proyecto: `pizza-mia-frontend`



```
