# nd-vite-template

Official Vite starter template for [NativeDocument](https://github.com/afrocodeur/native-document) — a reactive frontend framework with no Virtual DOM, no compiler, just plain JavaScript.

## Installation

Install the NativeDocument CLI globally:

```bash
npm install -g @native-document/cli
```

Verify the installation:

```bash
nd --help
```

## Getting started

The recommended way to scaffold a new project is via the NativeDocument CLI:

```bash
nd create MyApp
cd MyApp
npm start
```

Or with feature-based architecture:

```bash
nd create MyApp --feature
```

## Project structure

```
src/
├── main.js                        # Entry point
├── index.css                      # Global styles
│
├── core/
│   ├── lang/
│   │   ├── lang.js                # i18n configuration
│   │   └── locales/
│   │       ├── en.json            # English translations
│   │       └── fr.json            # French translations
│   ├── middlewares/               # Route middlewares
│   └── services/                  # Core services (http, i18n...)
│
├── routes/
│   ├── routes.js                  # Route definitions
│   └── layouts/
│       └── DefaultLayout/         # Default layout with language switcher
│
├── components/                    # Reusable UI components
│
├── pages/
│   ├── home/
│   │   ├── HomePage.js
│   │   └── home.css
│   └── not-found/
│       ├── NotFoundPage.js
│       └── not-found.css
│
└── services/                      # Business logic + observables
```

## CLI commands

Scaffold new files using the NativeDocument CLI:

```bash
# Create a new page
nd create:page dashboard

# Create a new component
nd create:component user-card

# Create a new service
nd create:service auth

# Create a new feature (feature mode only)
nd create:feature auth
```

## i18n

Translations live in `src/core/lang/locales/`. Add a new key to both `en.json` and `fr.json`:

```json
{
    "My new key": "My new key"
}
```

Then use it in your components:

```js
import { tr } from 'native-document/i18n';

P(tr('My new key'))
```

Scan for missing translation keys:

```bash
npm run i18n:scan
```

## Routing

Routes are defined in `src/routes/routes.js`:

```js
import { Router } from 'native-document/router';
import DefaultLayout from '@/routes/layouts/DefaultLayout/DefaultLayout';
import HomePage from '@/pages/home/HomePage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';

export default Router.create({ name: 'default', mode: 'history' }, (router) => {

    router.group('', { layout: DefaultLayout }, () => {
        router.add('/', HomePage);
        router.add('{*}', NotFoundPage);
    });

});
```

## Feature mode

When created with `--feature`, the project includes a `src/features/` folder. Each feature is self-contained:

```
src/features/auth/
├── components/
├── services/
│   └── AuthService/
│       └── AuthService.js
├── utils/
└── index.js              # Public API gate
```

Import from a feature via its public API:

```js
import { AuthService } from '@/features/auth';
```

## Scripts

```bash
npm start        # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run i18n:scan # Scan for missing translation keys
```

## Built with

- [NativeDocument](https://github.com/afrocodeur/native-document) — reactive frontend framework
- [Vite](https://vite.dev) — build tool

## License

MIT