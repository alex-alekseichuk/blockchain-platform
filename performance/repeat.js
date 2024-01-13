/**
 * IT DOES NOT WORK! Because da-sd-samples repo is not a dependency anymore.
 *
 * Simple repeater CLI tool to run da-sdk-samples a lot of times simultaneously as a load-test.
 * The test means to run a session of `num` steps.
 * On each step we increase the `concurrent` number of the parallel threads/workers.
 * Each thread runs the sample `perThread` times.
 * There is only time of run metric.
 */
'use strict';
const args = require('yargs') // eslint-disable-line
  .usage('Usage: $0 [options]')
  .option('sample', {
    alias: 's',
    type: 'string',
    describe: 'Sample name from ng-rt-digitalAsset-sdk-samples',
    demand: true
  })
  .option('concurrent', {
    alias: 'c',
    describe: 'Initial number of concurrent threads (workers)',
    default: 1
  })
  .option('perThread', {
    alias: 't',
    describe: 'Number of the tries per a thread',
    default: 1
  })
  .option('delta', {
    alias: 'd',
    describe: 'Increase step of concurrent parameter on each step',
    default: 1
  })
  .option('num', {
    alias: 'n',
    describe: 'Number of steps',
    default: 1
  })
  .option('csv', {
    type: 'string',
    describe: 'Path to output csv file'
  })
  .option('plot', {
    alias: 'p',
    type: 'boolean',
    describe: 'Flag to draw the plot of avg. time'
  })
  .argv;

if (!args.sample)
  throw new Error('Please set your sample by --sample=yourSample');

// const samples = require('ng-rt-digitalasset-sdk-sample');
// if (!samples[args.sample])
//   throw new Error(`No ${args.sample} sample`);
// const sample = samples[args.sample];

main();

async function main() {
  if (args.num === 1) {
    // single step session
    const result = await runStep(sample, args.n, args.concurrent);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // multi-step run
  const results = [];
  for (let step = 0, c = args.concurrent; step < args.num; step++, c += args.delta) {
    const result = await runStep(sample, args.perThread, c);
    results.push(result);
  }
  if (args.csv)
    await outputCsv(results, args.csv, args);
  if (args.plot)
    plotResults(results);
}

async function runStep(sample, perThread, concurrent) {
  perThread = perThread || 1;
  concurrent = concurrent || 1;
  const total = concurrent * perThread;
  let success = 0, fail = 0;
  let min, max, sum = 0;
  let i = 0;
  async function worker() {
    while (i < total) {
      i++;
      const started = (new Date()).getTime();
      let result = null;
      try {
        result = await sample();
      } catch {
      }

      if (result) {
        success++;
        const period = (new Date()).getTime() - started;
        if (!min || period < min)
          min = period;
        if (!max || period > max)
          max = period;
        sum += period;
      } else {
        fail++;
      }
    }
  }
  await Promise.all(Array(concurrent).fill(null).map(() => worker()));
  return {
    success, fail,
    min, max, average: sum / success
  }
}

function plotResults(results) {
  const asciichart = require ('asciichart');
  const arr = results.map(r => r.average);
  console.log(asciichart.plot(arr, {height: 10}));
}

async function outputCsv(results, csvPath, args) {
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: csvPath,
    header: [
      {id: 'th', title: 'Threads'},
      {id: 'min', title: 'Min'},
      {id: 'average', title: 'Average'},
      {id: 'max', title: 'Max'},
      {id: 'success', title: 'Success cases'},
      {id: 'fail', title: 'Failed cases'},
    ]
  });
  csvWriter
    .writeRecords(results.map((r, i) => Object.assign({th: args.concurrent + i*args.delta}, r)))
    .then(()=> console.log(`The CSV file  ${args.csv} was written successfully`));
}
