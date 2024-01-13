/**
 * Plot a chart in console.
 * It's both the CLI tool to draw the plots by the column of csv file
 * and the module to draw plots as npm dependency.
 *
 * node-ts src/plot.ts --file=./sample-server1-usage.csv --column=cpu
 */
import { loadMetric } from './util';

const asciichart = require('asciichart');

export class plot {
  static plot(records: Array<number>, d: number = 100): void {
    let n: number = Math.floor(records.length / d);
    if (n * d < records.length)
      n++;
    for (let i: number = 0; i < n; i++) {
      console.log(asciichart.plot(records.slice(i * d, (i + 1) * d), {height: 10}));
      console.log('');
    }
  }
  static plotSeries(recordsets: Array<Array<number>>, d: number = 100): void {
    const records: Array<number> = recordsets[0];
    let n: number = Math.floor(records.length / d);
    if (n * d < records.length)
      n++;
    for (let i: number = 0; i < n; i++) {
      console.log(asciichart.plot(
        recordsets.map(records => records.slice(i * d, (i + 1) * d)),
        {height: 10}));
      console.log('');
    }
  }
}

if (require.main === module) {
  drawPlot();
}

async function drawPlot() {
  const args = require('yargs') // eslint-disable-line
    .usage('Usage: $0 [options]')
    .option('file', {
      alias: 'f',
      type: 'string',
      describe: 'Path to csv file with results',
      demand: true
    })
    .option('column', {
      alias: 'c',
      type: 'string',
      describe: 'Column of the table to plot',
      demand: true
    })
    .argv;

  if (!args.file)
    throw new Error('Please set your csv file with results --file=csvResultsFile');
  if (!args.column)
    throw new Error('Please set the column name in csv file --column=columnName');

  const csv = require('csv-parser');
  const fs = require('fs');

  const results: Array<number> = await loadMetric(args.file, args.column);
  plot.plot(results);
}
