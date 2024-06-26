# Contributing

## Getting Started

### Prerequisites
- `node`
- `pnpm`

### Fork
Fork the repo and clone your fork to get the artefacts locally.

### Set Upstream Repo
Set the upstream repo so you can raise a PR against that repo:

```bash
git remote add upstream git@github.com:iancharlesdouglas/carbon-components-qwik.git
```

### Install Dependencies
```bash
pnpm i
```

## Workflow

### IDE
In your IDE make the following settings:
- install the **ESLint extension** and set **format on save** to true
- tab stops should be 2 characters (as configured in Pretter/ESLint setup)
- print width should be 120 characters (as configured in Prettier/ESLint setup).

### Building
Run `pnpm build`.

## Submitting a Pull Request

### Sync Your Fork

Before submitting a pull request, make sure your fork is up to date with the latest upstream changes.

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### Submit a PR

After you've pushed your changes to remote, submit your PR. Make sure you are comparing `<YOUR_USER_ID>/feature` to `origin/main`.
