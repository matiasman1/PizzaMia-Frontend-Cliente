# Frontend - Proyecto "Pizza Mia"

## 🏢 Descripción General

El proyecto "Pizza Mia" consiste en el desarrollo de una aplicación frontend utilizando React + TypeScript + Vite, que incluye:

-   Una landing page de acceso público.
-   Un sistema de ecommerce para clientes.
-   Un panel de administración exclusivo para el administrador.

Cada una de estas tres áreas tiene sus propios componentes y vistas. No se comparten componentes reutilizables entre cliente, administrador o landing.

## 📁 Estructura de Carpetas Propuesta

```
pizza-mia-frontend/
├── public/
├── src/
│   ├── assets/               # Imágenes, logos, fuentes, etc.
│   ├── components/           # Componentes divididos por dominio
│   │   ├── Admin/              # Componentes reutilizables exclusivos del administrador
│   │   ├── Client/             # Componentes reutilizables exclusivos del cliente
│   │   ├── Landing/            # Componentes reutilizables exclusivos de la landing
│   │   └── Global/             # Componentes compartidos generales (si los hubiera)
│   ├── layouts/              # Layouts compartidos entre vistas
│   ├── routes/               # Definiciones de rutas (React Router)
│   ├── services/             # Servicios y llamadas HTTP a APIs
│   ├── types/                # Tipos e interfaces TypeScript globales
│   ├── utils/                # Funciones utilitarias
│   ├── styles/               # Estilos globales y específicos por dominio
│   │   ├── base/             # Reset, tipografías, estilos globales
│   │   ├── themes/           # Estilos específicos por dominio
│   │   │   ├── landing.css
│   │   │   ├── client.css
│   │   │   └── admin.css
│   │   ├── variables.css     # Variables CSS globales (colores, fuentes, etc.)
│   │   └── index.css         # Entrada principal de estilos globales
│   ├── pages/
│   │   ├── landing/
│   │   │   └── modules/     # (opcional) Secciones reutilizables o vistas divididas por áreas temáticas
│   │   ├── client/
│   │   │   └── modules/     # (opcional) Secciones si se dividen vistas del cliente
│   │   └── admin/
│   │       └── modules/     # Vistas por sección del panel admin
│   │       
│   ├── contexts/             # Context API (Auth, carrito, etc.)
│   ├── hooks/                # Custom hooks (useAuth, useCart, etc.)
│   ├── App.tsx               # Componente principal
│   └── main.tsx              # Punto de entrada de la aplicación
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔄 Rutas Principales

-   `/` ➜ Landing page
-   `/client/*` ➜ Portal de clientes (compras, productos, perfil, etc.)
-   `/admin/*` ➜ Portal de administradores (gestión de productos, pedidos, etc.)

## 📦 Dependencias Instaladas

Estas son las principales dependencias utilizadas en el proyecto:

```bash
npm install react-router-dom
```

-   **react-router-dom**: para el manejo de rutas en la SPA.


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