/**
 * Sample performance test: local and remote recorders
 *
 * npx ts-node src/test/sample.ts
 * npx ts-node src/test/sample.ts > plots.txt
 *
 * npm run build
 * node build/sample.js
 */
import { plot } from '../plot';
import { delay } from '../util';
import { test, plotServersUsage } from './common';

(async function() {
  const clientTimer = test.to('client').manually().timer();

  // simple array fill/reverse case
  await test.start();
  for (let i = 0; i < 50; i++) {
    clientTimer.startTimer();
    let arr = Array(1e3).fill(Math.random());
    arr.reverse();
    await delay(100);
    clientTimer.record();
  }
  await test.stop();

  // draw plots of results to stdout
  plot.plot(test.storage.getResults('client').map(r => r['timer']));
  await plotServersUsage();

  test.saveCsv('sample-');
})();
