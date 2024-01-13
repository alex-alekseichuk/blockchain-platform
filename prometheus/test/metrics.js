const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
// const prefix = 'test_';
// collectDefaultMetrics({ prefix });

collectDefaultMetrics({
	timeout: 10000,
	gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
});

// console.log(client.register.metrics());
client.register.metrics().then((what) => {
  console.log(what);
});

// const { collectDefaultMetrics, register } = require('..');

// collectDefaultMetrics({
// 	timeout: 10000,
// 	gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
// });

// console.log(register.metrics());