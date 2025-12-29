const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for @iabtcf/core package resolution issue
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
