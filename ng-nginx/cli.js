#!/usr/bin/env node

const fs = require('fs-extra-p');
const path = require('path');
const util = require('util');
const logger = require('ng-common').logger.console();
const rawExec = util.promisify(require('child_process').exec);

const nginxImage = 'nginx:alpine-perl';
let argv;

const exec = async cmd => {
  try {
    return (await rawExec(cmd)).stdout.split('\n')[0];
  } catch (err) {
    logger.error(err.message);
    throw Error(`Failed execute: ${cmd}`);
  }
};

const initConfig = () => {
  return {
    configBaseUrl: 'http://localhost',
    coreUrl: 'http://localhost:8443',
    locations: {}
  };
};

const loadConfig = async () => {
  const configPath = argv.config || './frontend-config.json';
  try {
    const config = await fs.readJson(configPath);
    config.arrLocations = Object.keys(config.locations).map(name => {
      const record = config.locations[name];
      const location = Object.assign({name}, record);
      if (record.type === 'repo') location.isRepo = true;
      if (record.type === 'folder') location.isFolder = true;
      if (record.type === 'proxy') location.isProxy = true;
      return location;
    });
    return config;
  } catch (err) {
    logger.error(err.message);
    throw Error(`Can't login config from ${configPath}`);
  }
};

const saveConfig = async config => {
  const configPath = argv.config || './frontend-config.json';
  try {
    await fs.writeJson(configPath, config, {spaces: 2});
  } catch (err) {
    logger.error(err.message);
    throw Error("Can't save config to ${configPath}");
  }
};

const pullRepo = async (name, location) => {
  await fs.mkdirp('repos');
  if (location.branch)
    await exec(`cd repos;git clone -b ${location.branch} ${location.url} ${name};cd ..`);
  else
    await exec(`cd repos;git clone ${location.url} ${name};cd ..`);
};

const renderNginxConfig = async config => {
  const mustache = require('mustache');
  const configPath = argv.nginxConfig || './nginx.conf';
  try {
    const template = await fs.readFile(path.resolve(__dirname, 'nginx.conf.mustashe'), 'utf8');
    await fs.outputFile(configPath, mustache.render(template, config));
  } catch (err) {
    logger.error(err.message);
    throw Error(`Can't generate nginx config ${config``}`);
  }
};

// commands

const init = async () => {
  const config = initConfig();
  await saveConfig(config);
};
const addRepo = async () => {
  const config = await loadConfig();
  const location = {
    type: 'repo',
    url: argv.url,
  };
  if (argv.branch) location.branch = argv.branch;
  if (argv.path) location.path = argv.path;
  config.locations[argv.name] = location;
  await saveConfig(config);
  await pullRepo(argv.name, location);
};
const addFolder = async () => {
  const config = await loadConfig();
  config.locations[argv.name] = {
    type: 'folder',
    path: argv.path
  };
  await saveConfig(config);
};
const addProxy = async () => {
  const config = await loadConfig();
  config.locations[argv.name] = {
    type: 'proxy',
    url: argv.url
  };
  await saveConfig(config);
};
const removeLocation = async () => {
  const config = await loadConfig();
  delete config.locations[argv.name];
  await saveConfig(config);
};

const configure = async () => {
  const config = await loadConfig();
  await renderNginxConfig(config);
};

const pullAll = async () => {
  const config = await loadConfig();
  await fs.remove('repos');
  await fs.mkdirp('repos');
  await Object.keys(config.locations).forEach(async name => {
    const record = config.locations[name];
    if (record.type !== 'repo')
      return;
    try {
      await pullRepo(name, record);
    } catch (err) {
      logger.error(err.message);
      throw Error(`Can't pull repo ${record.url}`);
    }
  });
};

const run = async () => {
  const config = await loadConfig();
  await renderNginxConfig(config);
  const folderVolumes = config.arrLocations
    .filter(l => l.type === 'folder')
    .map(location =>
      `-v ${location.path}:/usr/share/nginx/${location.name}:ro`
    ).join(' ');
  const repoVolumes = config.arrLocations
    .filter(l => l.type === 'repo')
    .map(location =>
      `-v ${process.cwd()}/repos/${location.name}${location.path ? '/'+location.path : ''}:/usr/share/nginx/${location.name}:ro`
    ).join(' ');
  const name = argv.name || 'project-frontend';
  const port = argv.port || 80;
  try {
    const cmdRun = `docker run --name ${name} -p 80:${port} \
      -v ${process.cwd()}/nginx.conf:/etc/nginx/nginx.conf:ro \
      -v ${__dirname}/index:/usr/share/nginx/index:ro \
      ${folderVolumes} \
      ${repoVolumes} \
      -d ${nginxImage}`;
    await exec(cmdRun);
  } catch (err) {
    logger.error(err.message);
    throw Error(`Can't start docker container ${name}`);
  }
};
const stop = async () => {
  const name = argv.name || 'project-frontend';
  try {
    await exec(`docker stop ${name}`);
    await exec(`docker rm ${name}`);
  } catch (err) {
    logger.error(err.message);
    throw Error(`Can't stop docker container ${name}`);
  }
};
const restart = async () => {
  try {
    await stop();
  } catch (err) {}
  await run();
};

const build = async () => {
  const config = await loadConfig();
  await renderNginxConfig(config);
  const imageName = argv.name || 'project-frontend';
  try {
    await fs.mkdir('./tmp');
  } catch (err) {}
  await config.arrLocations
    .filter(l => l.type === 'folder')
    .forEach(async l => await fs.copy(l.path, `./tmp/${l.name}`));
  const foldersCopy = config.arrLocations
    .filter(l => l.type === 'folder')
    .map(location =>
      `COPY ./tmp/${location.name} /usr/share/nginx/${location.name}`
    ).join('\n');
  const repoCopy = config.arrLocations
    .filter(l => l.type === 'repo')
    .map(location =>
      `COPY ./repos/${location.name}${location.path ? '/'+location.path : ''} /usr/share/nginx/${location.name}`
    ).join('\n');
  const text = `
FROM ${nginxImage}
COPY ./nginx.conf /etc/nginx
${foldersCopy}
${repoCopy}
`;
  await fs.writeFile('./Dockerfile', text);
  await exec(`docker build -t ${imageName} .`);
  await fs.remove('./tmp');
};


const commandWrapper = f => {
  return _argv => {
    argv = _argv;
    f(argv).catch(err => logger.error(err.message));
  }
};

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('init', 'init blank frontend config file', () => {}, commandWrapper(init))
  .command('addRepo', 'add git repository as a source', yargs => {
    return yargs
      .option('name', {
        describe: 'application name',
        demand: true
      })
      .option('url', {
        describe: 'git repo URL',
        demand: true
      })
      .option('branch', {
        describe: "specific branch",
      })
      .option('path', {
        describe: "relative path inside repo to folder with static content like dist/build",
      });
  }, commandWrapper(addRepo))
  .command('addFolder', 'add existing static folder', yargs => {
    return yargs
      .option('name', {
        describe: 'application name',
        demand: true
      })
      .option('path', {
        describe: 'path to the folder with static files of application',
        demand: true
      });
  }, commandWrapper(addFolder))
  .command('addProxy', 'add proxy to application in development mode', yargs => {
    return yargs
      .option('name', {
        describe: 'application name',
        demand: true
      })
      .option('url', {
        describe: 'git repo URL',
        demand: true
      });
  }, commandWrapper(addProxy))
  .command('remove', 'remove location', yargs => {
    return yargs
      .option('name', {
        describe: 'application name',
        demand: true
      });
  }, commandWrapper(removeLocation))
  .command('configure', 'generate nginx.conf', () => {}, commandWrapper(configure))
  .command('pull', 'pull all git repos listed in the config', () => {}, commandWrapper(pullAll))
  .command('run', 'run nginx docker container for development mode', yargs => {
    return yargs
      .option('name', {
        describe: 'container name'
      })
      .option('port', {
        describe: 'custom port'
      });
  }, commandWrapper(run))
  .command('stop', 'stop nginx docker container', yargs => {
    return yargs
      .option('name', {
        describe: 'container name'
      });
  }, commandWrapper(stop))
  .command('restart', 'restart nginx docker container', yargs => {
    return yargs
      .option('name', {
        describe: 'container name'
      });
  }, commandWrapper(restart))
  .command('build', 'build docker image', yargs => {
    return yargs
      .option('name', {
        describe: 'image name'
      });
  }, commandWrapper(build))
  .option('config', {
    describe: 'Path to custom config file'
  })
  .argv;
