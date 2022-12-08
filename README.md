# vuetify3-vite-template

a simple but complete template for Vuetify app development.

## Features

- TypeScript
- Vite
- Vue 3
- Vuetify
- Vue-Router
- Pinia
- Prettier
- MockJS
- Electron (optional)

## Quick Start

install dependencies:

```bash
yarn install
```

serve web app:

config see `vite.config.ts` and `configs/dev-config.json`

```bash
yarn dev
```

serve electron and load web app:

config see `scripts/serve-electron.js` and `configs/dev-config.json`

```bash
yarn dev
yarn dev:e
```

build web assets:

```bash
yarn build
```

build electron with [electron-builder](https://www.electron.build/):

config see `vite.config.ts`, `scripts/build-electron.js`

```bash
yarn build
yarn build:s
yarn build:e
```
