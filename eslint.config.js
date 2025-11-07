const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Find the settings object in the expoConfig
const settingsObject = expoConfig.find(c => c.settings);

// Merge the new resolver with the existing one
if (settingsObject) {
  settingsObject.settings['import/resolver'] = {
    ...settingsObject.settings['import/resolver'],
    typescript: true,
  };
}

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
