import { Dict } from './util';
import { CpuMetric, IMetric, MemoryMetric, TimerMetric } from './metrics';
import { Record } from './storages';
import { IController } from './controller';

export class Recorder {
  constructor(controller: IController, key: string = 'records') {
    this.controller = controller;
    this.key = key;
  }

  readonly controller: IController;
  readonly key: string;
  type: string = 'manual';
  readonly metrics: Dict<IMetric> = {};

  // Build interface

  // types
  periodically(period: number): Recorder {
    this.period = period;
    this.type = 'period';
    return this;
  }
  manually(): Recorder {
    this.type = 'manual';
    return this;
  }

  // metrics
  cpu(): Recorder {
    this.metrics['cpu'] = new CpuMetric();
    return this;
  }
  memory(): Recorder {
    this.metrics['memory'] = new MemoryMetric();
    return this;
  }
  timer(): Recorder {
    this.metrics['timer'] = new TimerMetric();
    return this;
  }

  // Runtime interface
  async start(): Promise<void> {
    if (this.type === 'period') {
      if (this._timer)
        return;
      this._timer = setInterval((): void => {
        this._record();
      }, this.period);
    }
  }
  async stop(): Promise<void> {
    if (this.type === 'period') {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = undefined;
      }
    }
  }
  record(params?: Record): void {
    this._record(params);
  }
  startTimer(): void {
    (this.metrics['timer'] as TimerMetric).start();
  }
  stopTimer(): void {
    (this.metrics['timer'] as TimerMetric).stop();
  }

  protected _record(params?: Record) {
    if (!params)
      params = {};
    for (const key in this.metrics) {
      const value = this.metrics[key].record();
      if (typeof value === 'number')
        params[key] = value;
      else
        Object.assign(params, value);
    }
    params['timestamp'] = new Date().getTime();
    this.controller.storage.save(this.key, params);
  }

  private period: number = 100;
  private _timer?: NodeJS.Timeout;
}
