# Star Wars Fans

Sitio para fans de Star Wars hecho con Next.js y GraphQL. Lista los 82 personajes del API de SWAPI, permite buscarlos por nombre y al abrir uno muestra sus películas, quién las dirigió y los planetas que aparecen en cada una.

- **Demo:** https://starwars-fans.vercel.app
- **Repo:** https://github.com/Ctrl232/Starwars-fans

## Cómo correrlo

Necesitas Node 20.9 o superior.

```bash
git clone https://github.com/Ctrl232/Starwars-fans.git
cd Starwars-fans
npm install
npm run dev
```

Queda en http://localhost:3000. No hace falta configurar nada: las variables de entorno tienen valores por defecto. Si quieres cambiarlas, copia `.env.example` a `.env.local`.

| Variable | Para qué sirve |
| --- | --- |
| `SWAPI_GRAPHQL_URL` | Endpoint principal (por defecto `https://swapi-graphql.netlify.app/graphql`) |
| `SWAPI_GRAPHQL_FALLBACK_URL` | Endpoint alterno. Si el principal falla, el proxy lo intenta automáticamente |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, se usa en los metadatos |

Otros scripts:

```bash
npm test            # pruebas con Vitest + Testing Library
npm run lint
npm run typecheck
npm run codegen     # regenera los tipos desde el schema del API
npm run build
```

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Apollo Client 4** para las consultas y la caché
- **GraphQL Code Generator** para generar los tipos a partir del schema (no hay `any` en los datos del API)
- **Material UI** como kit de componentes
- **Vitest + React Testing Library** para las pruebas
- **GitHub Actions** corre lint, typecheck, tests y build en cada PR
- **Vercel** para el despliegue

## Qué hace

- Listado en tarjetas con paginación por cursor y scroll infinito. Si el scroll no dispara (o se navega con teclado) hay un botón de "Cargar más".
- Cada tarjeta muestra en cuántas películas aparece el personaje y tiene un botón claro para ver el detalle.
- El detalle se abre en un modal y la URL cambia a `/characters/:id`. Al cerrarlo vuelve a `/`, y el botón atrás del navegador también lo cierra.
- Si entras directo a `/characters/:id`, la página carga con el modal abierto. Esa ruta se renderiza en el servidor y tiene su propio título y descripción, así que el link se ve bien al compartirlo.
- Buscador por nombre con debounce de 300 ms. No distingue tildes ni mayúsculas ("padme" encuentra a "Padmé").
- Estados de carga con skeletons, errores con botón de reintentar y estados vacíos.
- Accesibilidad: foco atrapado dentro del modal y devuelto al botón al cerrar, cierre con Esc, enlace para saltar al contenido, anuncios de resultados con `aria-live`, foco visible y respeto a `prefers-reduced-motion`.

## Decisiones técnicas

**El API devuelve los personajes casi vacíos.** Al probar contra el endpoint real vi que `person` solo trae `name`: el resto de campos llega en `null` y `filmConnection` viene vacío. Las películas, en cambio, sí vienen completas y cada una trae `characterConnection` con los IDs de sus personajes. Entonces invertí la relación: pido una sola vez el catálogo de películas (son 6), Apollo lo guarda en caché y con eso saco las películas de cualquier personaje filtrando por su ID. La función `getCharacterFilms` combina las dos fuentes, así que si el API vuelve a traer `filmConnection` también se tiene en cuenta. Los datos biográficos que llegan vacíos no los muestro como una lista de "Desconocido": el modal lo avisa y muestra lo que sí hay. El endpoint alterno (`swapi.loquenecesito.co`) no respondía mientras hice la prueba.

**Proxy propio en `/api/graphql`.** El navegador nunca llama directo al API externo, siempre pasa por una Route Handler de Next. Con eso no hay problemas de CORS, puedo reintentar contra el endpoint alterno con un timeout por intento, valido el body (tamaño máximo, solo queries, nada de mutations) y puedo dejar una CSP con `connect-src 'self'`. En un proyecto con datos sensibles, ese mismo punto es donde agregaría autenticación, rate limiting y auditoría sin tocar el frontend.

**La URL manda sobre el modal.** El hook `useCharacterRoute` saca el personaje abierto de `usePathname()`. Para abrir y cerrar uso `history.pushState`, que Next 16 integra con su router, entonces la URL cambia al instante sin volver a pedir la página al servidor. Si el modal se abrió desde el listado, cerrarlo equivale a ir atrás; si entraste directo por el link, cerrar reemplaza la URL por `/` para no sacarte del sitio.

**SSR del detalle sin pedir los datos dos veces.** La página `/characters/[id]` trae el personaje y el catálogo de películas en el servidor. Uso `React.cache` para que `generateMetadata` y la página compartan la misma petición, y después escribo esos datos en la caché de Apollo del cliente con `writeQuery`. Así el modal abre con la información y Apollo no vuelve a consultar.

**Paginación con la caché de Apollo.** El tipo raíz del schema se llama `Root` y no `Query`, por eso la política de caché lleva `queryType: true`. `allPeople` guarda dos entradas: la lista paginada, donde el `merge` va concatenando las páginas que llegan con `fetchMore`, y el índice completo que usa el buscador.

**Búsqueda en el cliente.** El API no tiene un filtro por nombre. Cuando el usuario empieza a escribir pido un índice liviano con los 82 personajes (solo los campos de la tarjeta), queda en caché y filtro en memoria. Con un backend propio lo haría con un argumento `search` en la query.

**Precarga del detalle.** Cuando el mouse pasa por el botón "Ver detalle" (o recibe el foco) ya se lanza la consulta del personaje, así que normalmente el modal abre sin esperar.

**Separar datos de presentación.** `CharacterExplorer` es el único que maneja datos y estado. Las tarjetas, la grilla, el contenido del detalle y los estados de error y vacío solo reciben props, por eso se pueden probar sin simular la red.

## Estructura

```
src/
├── app/
│   ├── api/graphql/route.ts        proxy hacia SWAPI con fallback
│   ├── characters/[id]/page.tsx    detalle renderizado en servidor + metadatos
│   └── layout.tsx, page.tsx, error.tsx, not-found.tsx
├── components/
│   ├── characters/                 explorer, tarjeta, grilla, modal, buscador
│   ├── feedback/                   estados de error y vacío
│   ├── layout/, providers/
├── graphql/queries.ts              queries y fragmentos
├── gql/                            código generado por Codegen (no se edita a mano)
├── hooks/                          ruta del modal, debounce, scroll infinito
├── lib/                            cliente Apollo, fetch en servidor, utilidades
└── theme/, test/
```

## Git

Trabajé con una rama por funcionalidad (`chore/project-setup`, `feat/graphql-layer`, `feat/ui-foundation`, `feat/characters-list`, `feat/character-detail`, `feat/search`, `test/unit-tests`, `docs/readme`), commits siguiendo Conventional Commits y merge a `main` por Pull Request, con el CI en verde antes de cada merge.

## Qué mejoraría con más tiempo

- Pruebas end to end con Playwright (abrir el modal, revisar la URL, botón atrás, entrada directa) corriendo en el CI.
- Prerenderizar los 82 personajes con `generateStaticParams` e ISR.
- Imágenes de los personajes desde una fuente propia con `next/image`, porque el API no las trae.
- Filtros por película o especie, y guardar la búsqueda en la URL (`?q=`).
- Cambiar `'unsafe-inline'` de la CSP por nonces, agregar rate limiting al proxy y monitoreo de errores.
