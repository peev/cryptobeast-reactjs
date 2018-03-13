const { injectBabelPlugin } = require('react-app-rewired');
const rewireMobX = require('react-app-rewire-mobx');

function overrideConfig(config, env) {
  const configBabel = injectBabelPlugin('babel-plugin-styled-components', config);
  const configResult = rewireMobX(configBabel, env);

  return configResult;
}

module.exports = overrideConfig;
