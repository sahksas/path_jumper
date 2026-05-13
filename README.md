# Chrome Extension TypeScript Starter

Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

- [node](https://nodejs.org/) (Current Version)
- [pnpm](https://pnpm.io/)

## Option

- [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

- TypeScript
- Webpack
- React
- Jest
- Prettier
- i18n (Internationalization)
- Example Code
  - popup
  - options
  - content script
  - background (service worker)

## Project Structure

- src: TypeScript source files
- public: static files (manifest.json, HTML, icons, _locales)
- dist: Chrome Extension directory (build output)
- dist/js: Generated JavaScript files

## Setup

```
pnpm install
```

## Build

```
pnpm build
```

## Build in watch mode

### terminal

```
pnpm watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Clean build output

```
pnpm clean
```

## Format code

```
pnpm format
```

## Load extension to chrome

Load `dist` directory

## Test

`pnpm test`
