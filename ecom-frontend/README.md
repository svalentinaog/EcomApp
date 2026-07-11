# ecom-app

Aplicación web de comercio electrónico construida con React, TypeScript y Vite. Proyecto educativo del SENA con arquitectura modular, estilos en SCSS y consumo de datos estáticos.

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+ o pnpm/yarn

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

- Arranca un servidor de desarrollo de Vite en `http://localhost:5173/` (puede variar).
- Alias de rutas: `@` apunta a `src` (configurado en `vite.config.ts:8-11`).

## Construcción

```bash
npm run build
```

- Genera la carpeta `dist/` con la versión de producción.
- Previsualización local:

```bash
npm run preview
```

## Linter

```bash
npm run lint
```

- Configurado con ESLint y TypeScript (`eslint.config.js`).

## Estructura del proyecto

```
├─ public/              # Estáticos servidos sin empaquetar
│  ├─ images/
│  └─ data.json         # Fuente de datos de productos
├─ src/
│  ├─ assets/           # Íconos, imágenes y `index.ts`
│  ├─ components/       # UI por niveles: molecules, sections, templates
│  ├─ layouts/          # Layouts: Header, Footer, Container, etc.
│  ├─ pages/            # Páginas: HomePage, LoginPage, ShopPage, etc.
│  ├─ styles/           # SCSS modular (abstracts, base, layout, components)
│  ├─ types/            # Tipos TypeScript (p.ej. `Product`)
│  ├─ App.tsx           # Enrutamiento
│  └─ main.tsx          # Punto de entrada y estilos globales
├─ index.html           # Documento raíz
├─ vite.config.ts       # Configuración de Vite y alias
├─ package.json         # Scripts y dependencias
└─ eslint.config.js     # Configuración de ESLint
```

## Enrutamiento

- Definido con `react-router-dom` en `src/App.tsx:7-13`.
- Ruta principal `/` renderiza `HomePage` dentro de `BaseLayout`.

## Datos y Tipos

- Los productos se cargan desde `public/data.json` usando `axios` en `src/components/sections/home/ProductListSection.tsx:15`.
- Tipo de producto definido en `src/types/Product.ts`.

## Estilos

- SCSS global importado en `src/main.tsx:5` y compuesto desde `src/styles/main.scss:1-12`.
- Utiliza parciales para variables, mixins y módulos de componentes/layout.

## Scripts disponibles

- `npm run dev`: servidor de desarrollo
- `npm run build`: compilación de producción (TypeScript + Vite)
- `npm run preview`: previsualizar `dist/`
- `npm run lint`: análisis estático con ESLint

## Notas

- Variables de entorno `.env`: Por el momento no se requieren.

## Autor

- Sandra Valentina Ortiz Gonzalez
