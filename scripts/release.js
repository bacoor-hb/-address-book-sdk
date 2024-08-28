const inquirer = require('inquirer');
const shelljs = require('shelljs');
inquirer.default
  .prompt([
    {
      type: 'list',
      name: 'nextReleaseVersionType',
      message: 'Which version would you like to release next?',
      choices: ['patch', 'minor', 'major'],
      default: 'patch',
    },
  ])
  .then(async (answers) => {
    const package = require('../package.json');
    console.log('Current version: ', package.version);

    const [major, minor, patch] = package.version
      .split('.')
      .map((v) => parseInt(v));
    let nextVersion;
    if (answers.nextReleaseVersionType === 'major') {
      nextVersion = `${major + 1}.0.0`;
    } else if (answers.nextReleaseVersionType === 'minor') {
      nextVersion = `${major}.${minor + 1}.0`;
    } else {
      nextVersion = `${major}.${minor}.${patch + 1}`;
    }
    console.log('Next version: ', nextVersion);

    package.version = nextVersion;
    const fs = require('fs');
    fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
    shelljs.exec('npm run clean');
    shelljs.exec('npm run build');
    shelljs.exec('git add .')
    shelljs.exec(`git commit -m "release v${nextVersion}"`);
    shelljs.exec(`npm publish --access public`)
    console.log('Done <3');
  });
