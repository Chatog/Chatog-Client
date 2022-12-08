const builder = require('electron-builder');
const fs = require('fs');
const path = require('path');

// go go go!!!
function go() {
  copyPackageJson();
  build();
}
go();

/**
 * copy package.json from `.` to `./dist`
 */
function copyPackageJson() {
  const rawPath = path.join(__dirname, '../package.json');
  const tarPath = path.join(__dirname, '../dist/package.json');
  fs.copyFileSync(rawPath, tarPath);
  console.log('[build] successfully copy package.json');
}

/**
 * use electron-builder to build
 */
function build() {
  builder
    .build({
      targets: builder.Platform.WINDOWS.createTarget(),
      config: {
        directories: {
          output: 'package',
          app: 'dist'
        },
        appId: 'edu.nju.gstarp',
        productName: 'Vuetify3-Vite-APP',
        electronVersion: '19.1.2',
        compression: 'normal',
        removePackageKeywords: true,
        removePackageScripts: true,
        win: {
          target: 'nsis'
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          deleteAppDataOnUninstall: true
        }
      }
    })
    .then(() => {
      console.log('[build] success');
    })
    .catch((err) => {
      console.log('[build] fail', err);
    });
}
