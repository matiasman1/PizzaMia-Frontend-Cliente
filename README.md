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
│   │   ├── landing/          # Vistas de la landing page
│   │   ├── client/           # Vistas del frontend para clientes
│   │   └── admin/            # Vistas del panel de administración
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

A medida que se agreguen más funcionalidades (como manejo de estado, peticiones HTTP, validaciones, etc.), se irán agregando más dependencias como Axios, Zod, Zustand, etc.

## 📃 Nombre de la Arquitectura

La arquitectura utilizada se denomina:

**Feature-Based Modular Frontend Architecture con separación de dominios por rol (Landing, Cliente, Admin)**

Se basa en los siguientes principios:

-   **Feature-Based Modular Structure**: Agrupación del código por dominio funcional.
-   **Separation of Concerns (SoC)**: Separación clara de responsabilidades.
-   **Domain-Driven Design (DDD)** (adaptado al frontend): División basada en los roles y secciones del sistema.

## ✅ Buenas Prácticas Aplicadas

Esta arquitectura es altamente recomendada para proyectos con varios dominios funcionales, como Pizza Mia, ya que ofrece:

-   **Escalabilidad**: Estructura preparada para crecer sin volverse caótica.
-   **Mantenibilidad**: Código organizado y fácil de navegar.
-   **Separación de responsabilidades**: Admin, cliente y landing trabajan en contextos aislados.
-   **Facilita testing y colaboración en equipo**.

No es ideal para proyectos pequeños o prototipos simples, ya que podría ser innecesariamente compleja en esos casos.

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