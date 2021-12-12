# deploy-gh

[![npm version](https://img.shields.io/npm/v/deploy-gh.svg?style=flat-square)](https://www.npmjs.com/package/deploy-gh)

A simple script to deploy your GitHub project's main branch to GitHub pages.

See this package in action [here](https://nfischer.github.io/deploy-gh).

## Installation

```
npm install --save-dev deploy-gh
```

## Usage

This script makes a best effort attempt to pick out your GitHub project's main
branch (this prefers `main` if that branch exists, otherwise it falls back to
`master`). Then it merges this into the `gh-pages` branch and pushes this back
to the remote origin.

First, make sure you have an `index.html` file in the root of your repository.

Next, inside `package.json`:

```json
  "scripts": {
    "test": "... whatever you normally have here ...",
    "deploy": "deploy-gh"
  },
```

To run this, make sure all changes are committed on your main branch and then
run `npm run deploy`.
