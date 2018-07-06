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

// Figure out the user and project name for this repo.
var url = shell.exec('git remote show -n origin', {silent: true})
    .grep('Push')
    .replace(/^\s+Push\s+URL:\s+/, '')
    .trim();
var repoInfo;
if (url.match(/^https/)) {
  repoInfo = url.match(/https:..github.com\/([^./]+)\/([^./]+).*/);
} else if (url.match(/^git/)) {
  repoInfo = url.match(/git@github.com:([^/]+)\/([^.]+)\..*/);
} else {
  console.warn('Unknown origin pattern: "' + url + '"');
  shell.exit(0);
}

if (repoInfo) {
  var user = repoInfo[1];
  var project = repoInfo[2];
  shell.echo(['Deployed to https://', user, '.github.io/', project, '/'].join(''));
} else {
  console.warn('Unable to figure out repo name: ');
}
