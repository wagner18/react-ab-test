module.exports = {
  Experiment: require('./lib/Experiment').default,
  Variant: require('./lib/Variant').default,
  emitter: require('./lib/emitter').default,
  useExperiment: require('./lib/hooks').default,
  experimentDebugger: require('./lib/debugger'),
  mixpanelHelper: require('./lib/helpers/mixpanel').default,
  segmentHelper: require('./lib/helpers/segment').default,
};
