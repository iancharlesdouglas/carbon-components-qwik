# carbon-components-qwik

[![NPM][npm]][npm-url]
![GitHub](https://img.shields.io/github/license/iancharlesdouglas/carbon-components-qwik?color=262626&style=for-the-badge)

> [Carbon Design System](https://github.com/carbon-design-system) components as Qwik components.  

---

This library is an ongoing project to implement the React components of the Carbon Design System (v11) in Qwik.

## Components
See [components](COMPONENTS.md) for the list of implemented (and unimplemented) components.

## Project Structure
The basic project structure is as follows:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    ├── internal/
    │   ├── contexts
    │   └── hooks
    ├── shared-props
    └── index.ts
```
### Folders
- `src/components`: Root folder for all components, which are in sub-folders in `kebab-case` format
- `internal`: Internal functions, types etc:
  - `contexts`: Contexts to avoid prop drilling in certain circumstances
  - `hooks`: Custom hook functions (e.g. `usePrefix`)
- `shared-props`: Props shared by multiple components
- `index.ts`: The entry point the library -- all public components are exported from this file
- `public/` is the home folder for static resources in Vite.

## Development

### Running Unit Tests
There are **vitest** unit tests for each component (minimum coverage thresholds are set higher than 95% for all metrics).  To run these:
```
pnpm test
```
To run them with coverage:
```
pnpm coverage
```
All pushes to the GitHub repo will trigger a coverage run and a build run (which includes a linting check).

### Linter and Code Quality Rules
The linter is ESLint.  The spellcheck plugin is used (if you encounter a word not in the dictionary, just add it to the `skipWords` section of the `.eslintrc.json` file in the project root).  ESLint is configured to format code using Prettier.  TypeScript is configured in strict mode.  See [Contributing](CONTRIBUTING.md) for more details on setup.

### Running Test Page
```
pnpm start
```
This will launch a file called `test.tsx` (invoked from `root.tsx`) which is just a simple page containing components for preview purposes.

## Production

```
pnpm build
```

## Contributing
See [Contributing](CONTRIBUTING.md)

## Changelog
See [CHANGELOG](CHANGELOG.md)

## Licence
[Apache-2.0](LICENCE)

[npm]: https://img.shields.io/npm/v/carbon-components-qwik.svg?color=262626&style=for-the-badge
[npm-url]: https://npmjs.com/package/carbon-components-qwik
