# Reto Pokémon Microfrontends (Vite + Module Federation)

Arquitectura de microfrontends con **Shell (host)** + **2 Remotes**:

- `shell` (host)
- `pokemon-detail` (remote)
- `history` (remote)
- `@pokemon-mf/shared` (paquete compartido)

---

## Stack

- **React 19**
- **React Router DOM 7**
- **Vite 7**
- **@module-federation/vite**
- **@tanstack/react-query**
- **styled-components**
- **Zustand** (Shell)
- Monorepo con **npm workspaces**

---

## Puertos & Apps

- **3000**: `shell` (host)
- **3001**: `pokemon-detail` (remote)
- **3002**: `history` (remote)

---

## Requisitos

- Node.js (recomendado LTS)
- npm

---

## Instalación

```bash
npm install

## levantar todo con un comando :
npm run dev

Tabla de puertos (Apps)
App	Tipo	Puerto	URL
shell	Host	3000	http://localhost:3000

pokemon-detail	Remote	3001	http://localhost:3001

history	Remote	3002	http://localhost:3002

# /////////////////////////

Scripts (Root)

Estos scripts están en el package.json de la raíz (workspaces):
# Levanta Shell + Remotes en paralelo
npm run dev

# Levanta cada app por separado
npm run dev:shell
npm run dev:detail
npm run dev:history

# Build de todos los workspaces
npm run build

# Lint de todos los workspaces
npm run lint


Decisiones técnicas

Module Federation (Vite): integración runtime entre Shell y Remotes mediante remoteEntry.js.

Shell como Host y Router central: el Shell contiene el layout, navegación principal y enruta a vistas que provienen de remotes.

Shared package (@pokemon-mf/shared): utilidades y lógica reutilizable (API wrapper, normalizadores, helpers) para evitar duplicación entre microfrontends.

React Query: manejo de fetch, cache, estados loading/error, y reintentos controlados.

styled-components: estilos encapsulados, theming y consistencia visual.

Zustand (Shell): estado global simple (ej. tema) sin overhead de soluciones más complejas.

Workspaces (Monorepo): separación clara de apps y paquetes, con scripts centralizados en root.