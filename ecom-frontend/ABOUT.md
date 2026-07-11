# Ecom App

Aplicación de comercio electrónico desarrollada en un stack moderno como lo son React, TypeScript, Vite y SASS(SCSS) bajo el patrón 7-1. El objetivo es mantener la funcionalidad y el diseño original, modularizando la UI con principios de Atomic Design (parcialmente aplicado) y añadiendo capacidades de desarrollo rápido.

## Tecnologías

- Frontend: `React`, `TypeScript`, `Vite`, `React Router DOM`
- Estilos: `SASS` con patrón 7-1 (abstracts, base, components, layout, pages)
- Datos: `axios` consumiendo `public/data.json`
- Calidad: `ESLint` Flat Config (plugins `react-hooks`, `react-refresh`)

## Instalación y ejecución

- Requisitos: `Node.js >= 18`
- Pasos:
  - `npm install`
  - `npm run dev` inicia el servidor de desarrollo
  - `npm run build` genera el build de producción
  - `npm run preview` sirve el build generado
  - `npm run lint` ejecuta reglas de estilo y calidad

## Estructura de carpetas

- `src/`
  - `assets/` imágenes, íconos y `index.ts` para import centralizado
  - `components/`
    - `molecules/` componentes compuestos reutilizables
      - `common/SearchBar.tsx` barra de búsqueda
      - `home/ProductFilter.tsx` tabs de categorías
      - `home/ProductCard.tsx` tarjeta de producto
    - `sections/home/` organismos de la página de inicio
      - `HeroSection.tsx` hero principal
      - `FeaturesSection.tsx` beneficios (envío, devoluciones, soporte)
      - `ProductListSection.tsx` listado filtrable con datos
    - `templates/home/HomeTemplate.tsx` composición de organismos de Home
  - `layouts/` estructura de aplicación
    - `Header.tsx`, `Footer.tsx` y `CallToAction.tsx`
    - `BaseLayout.tsx` envuelve páginas y coloca header/cta/footer
  - `pages/`
    - `HomePage.tsx` renderiza la plantilla de Home
  - `styles/`
    - `abstracts/` variables y mixins (`_variables.scss`, `_mixins.scss`)
    - `base/` reset y tipografía (`_reset.scss`, `_typography.scss`)
    - `components/` estilos de componentes (`_product-card.scss`, `_product-filter.scss`, `_searchbar.scss`, `_buttons.scss`)
    - `layout/` estilos estructurales (`_container.scss`, `_layout.scss`, `_header.scss`, `_footer.scss`, `_CTA.scss`)
    - `pages/` agregadores por página (`_home.scss` importa secciones)
  - `types/Product.ts` tipado de productos
  - `App.tsx`, `main.tsx`
- `public/data.json` dataset de productos para el listado

## Guía de uso / funcionalidades

- Home
  - Hero con imagen y texto destacado
  - Beneficios: envío gratis, devoluciones en 30 días, soporte 24/7
  - Productos: filtro por categorías y tarjetas con imagen, precio y puntuación
  - CTA: banner inferior con llamada a la acción
- Layout
  - Header responsive con top bar, menú, buscador y carrito con contador
  - Footer con columnas de información y métodos de pago
- Ruteo
  - Ruta `/` para la página de inicio

## Ejemplo de datos

Los productos se consumen desde `public/data.json` mediante `axios` en `ProductListSection.tsx`. Puedes modificar categorías, precios e imágenes para personalizar la grilla.

## Capturas / referencias visuales

- Hero: `src/assets/images/image-section.jpg`
- Íconos y logos: carpeta `src/assets/icons/`

## Atomic Design (estado)

- Aplicado parcialmente:
  - Moléculas: `SearchBar`, `ProductFilter`, `ProductCard`
  - Organismos: `HeroSection`, `FeaturesSection`, `ProductListSection`, `Header`, `Footer`
  - Plantilla: `HomeTemplate`; Página: `HomePage`
- Próximos pasos:
  - Crear átomos (`Button`, `Heading`, `Icon`, `Input`) y adoptarlos en moléculas/organismos
  - Centralizar el fetch en página/plantilla y pasar datos por props

## Autor

- Autor: Sandra Valentina Ortiz Gonzalez
