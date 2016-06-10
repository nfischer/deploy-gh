# deploy-gh

A simple script to deploy master branch to github pages

See this package in action [here](https://nfischer.github.io/deploy-gh).

## Installation

```
npm install --save-dev deploy-gh
```

## Usage

This essentially just merges your master branch into your gh-pages branch and
pushes that to the origin repository.

First, make sure you have an `index.html` file in the root of your repository.

Next, inside `package.json`:

```json
  "scripts": {
    "test": "... whatever you normally have here ...",
    "deploy": "deploy-gh"
  },
```

To run this, make sure all changes are committed on your current branch and then
run `npm run deploy`.
