const packager = require('electron-packager');
const rebuild = require('electron-rebuild');

packager({
  dir: './',
  overwrite: true,
  asar: true,
  platform: 'win32',
  arch: 'ia32',
  icon: 'build/favicon.ico',
  prune: false,
  out: 'CryptoBeast',
  executableName: 'CryptoBeast',
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    rebuild.rebuild({ buildPath, electronVersion, arch })
      .then(() => callback())
      .catch((error) => callback(error));
  }],
});
