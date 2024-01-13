const csv = require('csv-parser');
const fs = require('fs');

/**
 * Format number value
 * @param n source number
 * @return the number like X.XX
 */
export function formatNum(n: number): number {
  return Math.round(n * 100) / 100;
}

export type Dict<valueT> = { [key: string] : valueT; };

export function delay(period: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, period));
}

export function loadColumn(file: string, column: string): Promise<Array<string>> {
  return new Promise(resolve => {
    const results: Array<string> = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row: any) => {
        results.push(row[column]);
      })
      .on('end', () => {
        resolve(results);
      });
  });
}

export function loadMetric(file: string, column: string): Promise<Array<number>> {
  return new Promise(resolve => {
    const results: Array<number> = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row: any) => {
        results.push(+row[column]);
      })
      .on('end', () => {
        resolve(results);
      });
  });
}

export async function runConcurrently(concurrent: number, perThread: number, beforeWorker: any, step: any) {
  let i = 0;
  const total = concurrent * perThread;
  async function worker(iWorker: number) {
    const worker = {i: iWorker};
    if (beforeWorker)
      await beforeWorker(worker);
    while (i < total) {
      i++;
      if (step)
        await step(worker, i-1);
    }
  }
  await Promise.all(Array(concurrent).fill(null).map((x, i) => worker(i)));
}
