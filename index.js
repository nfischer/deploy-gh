#!/usr/bin/env node
var shell = require('shelljs');

if (process.argv[2] === '--silent')
  shell.config.silent = true;

shell.exec('git checkout gh-pages');
if (shell.error()) {
  shell.exec('git checkout -b gh-pages');
  if (shell.error()) {
    console.error('unable to checkout gh-pages branch');
    shell.exit(1);
  }
}

shell.exec('git rev-parse --abbrev-ref HEAD');
shell.exec('git merge master --commit');
shell.exec('git push origin gh-pages');
shell.exec('git checkout -');
var repoInfo = shell.exec('git remote show -n origin', {silent: true})
    .grep('Push')
    .match(/https:..github.com\/([^./]+)\/([^./]+).*/);
if (repoInfo) {
  shell.echo(['Deployed to https://', repoInfo[1], '.github.io/', repoInfo[2] ,'/'].join(''));
} else {
  shell.echo('Unable to figure out repo name');
}
