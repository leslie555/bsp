#!/usr/bin/env node

const fs = require('fs-extra');
const inquirer = require('inquirer');

const cwd = process.cwd();

async function normal() {
  const questions = [
    {
      type: 'input',
      name: 'module',
      message: 'which module do you want to start :',
    },
  ];
  const modulename = await inquirer.prompt(questions);
  deal(modulename.module);
}

function deal(__modulename) {
  const pkg = JSON.parse(fs.readFileSync(`${cwd}/package.json`, 'utf8'));
  const modulPkg = JSON.parse(
    fs.readFileSync(`${cwd}/src/${__modulename}/package.config.json`, 'utf8')
  );

  for (const dep in modulPkg.dependencies) {
    if (!Object.prototype.hasOwnProperty.call(pkg, dep)) {
      pkg.dependencies[dep] = modulPkg.dependencies[dep];
    }
  }

  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(pkg, null, 2), 'utf8');
}

module.exports = function(args) {
  const modulename = args[3];
  if (!modulename) {
    normal(modulename);
    return;
  }
  deal(modulename);
};
