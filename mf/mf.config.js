// ключи -- поля name из package.json каждого микрофронтеда
const mfConfigJson = require('./mf.config.json');

const getMFConfig = (mode, mfName) => {
  const isDev = mode === 'development';

  if (isDev) {
    return mfConfigJson[mfName];
  }

  return '';
};

module.exports = {
  config: mfConfigJson,
  getMFConfig,
};
