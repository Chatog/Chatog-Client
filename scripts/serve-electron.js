const { join } = require('path');
const { spawn } = require('child_process');

const DevConfig = require('../configs/dev-config.json');

async function serveElectron() {
  // if specific then use, or use `node_modules/electron`
  let electronExecPath = DevConfig.ELECTRON_PATH;
  if (!electronExecPath) {
    electronExecPath = (await import('electron')).default;
  }
  const electronMainPath = join(__dirname, '../electron/main.js');

  // if already has electron process, remove it
  if (process.electronProcess) {
    process.electronProcess.removeAllListeners();
    process.electronProcess.kill();
  }

  const args = [electronMainPath];
  /**
   * --enable-loggind
   */
  if (DevConfig.ELECTRON_ENABLE_LOGGING) {
    args.push('--enable-logging');
  }

  console.log(`[spawn] ${electronExecPath} ${args.join(' ')}`);

  process.electronProcess = spawn(electronExecPath, args, {
    // let electron know current mode
    env: { NODE_ENV: 'development' },
    stdio: 'inherit'
  });
  process.electronProcess.once('exit', process.exit);
}

serveElectron();
