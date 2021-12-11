#!/usr/bin/env node
var shell = require('shelljs');

if (process.argv[2] === '--silent') {
  shell.config.silent = true;
}

var dryRun = false;
if (process.argv[2] === '--dryrun') {
  dryRun = true;
}

shell.exec('git checkout gh-pages');
if (shell.error()) {
  shell.exec('git checkout -b gh-pages');
  if (shell.error()) {
    console.error('unable to checkout gh-pages branch');
    shell.exit(1);
  }
}

function findMainBranch() {
  var gitMainBranches = [ 'main', 'master' ];
  for (branch of gitMainBranches) {
    var branchExists = shell.exec('git branch --list ' + branch, { silent: true }).trim() != '';
    if (branchExists) {
      return branch;
    }
  }
  throw new Error('Cannot determine main branch of repo');
}

var mainBranch = findMainBranch();
console.log('Merging ' + mainBranch + ' branch into gh-pages branch');
shell.exec('git merge ' + findMainBranch() + ' --commit');

if (dryRun) {
  console.warn('This is a dryrun, so this is not pushing to origin!');
} else {
  console.log('Deploying to gh-pages branch...');
  shell.exec('git push origin gh-pages', { fatal: true });
  console.log('Your change was successfully pushed!');
}
shell.exec('git checkout -', { fatal: true });

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
  console.warn('Unknown origin pattern: ' + JSON.stringify(url));
  shell.exit(0);
}

var ghPagesUrl = '[Unable to figure out GitHub pages URL]';
if (repoInfo) {
  var user = repoInfo[1];
  var project = repoInfo[2];
  ghPagesUrl = 'https://' + user + '.github.io/' + project + '/';
}

if (dryRun) {
  console.log('Would have deployed to ' + ghPagesUrl + ' (but this is a dryrun)');
} else {
  console.log('Deployed to ' + ghPagesUrl);
}

if (dryRun) {
  console.log('\nEven though this is a dryrun, this probably modified your ' +
              'local git branches (but should not have pushed those ' +
              'changes). Please verify the local branch changes and step ' +
              'back if necessary.');
}
