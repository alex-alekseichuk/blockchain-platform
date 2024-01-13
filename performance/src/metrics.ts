import { formatNum } from './util';

export interface IMetric {
  record(): any;
}

/**
 * CPU usage metric.
 * Value is a sum of CPU usages (user + system)
 * for period since previous record() call.
 */
export class CpuMetric implements IMetric {
  constructor() {
    this.usage = process.cpuUsage();
  }
  record() {
    const usage = process.cpuUsage(this.usage);
    this.usage = process.cpuUsage();
    return usage.user + usage.system;
  }

  private usage;
}

/**
 * Memory usage metric.
 * Value is a heap usage in Mb
 * for the moment of the record() call.
 */
export class MemoryMetric implements IMetric {
  record() {
    const mem = process.memoryUsage();
    return formatNum(mem.heapUsed / 1024 / 1024);
  }
}

/**
 * Timer.
 * Value is a period from start() call and stop() call in milliseconds.
 * @usage:
 * metric.start()
 * ...
 * Recorder._record()
 *   TimerMetric.record()
 *     TimerMetric.stop()
 */
export class TimerMetric implements IMetric {
  constructor() {
    this.start();
  }
  start(): void {
    this._started = new Date().getTime();
    this._finished = 0;
  }
  stop(): void {
    this._finished = new Date().getTime();
  }

  record() {
    if (!this._finished)
      this.stop();
    return {
      timer: this._finished - this._started,
      started: this._started,
      finished: this._finished
    };
  }

  private _started: number = 0;
  private _finished: number = 0;
}
