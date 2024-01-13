import axios from 'axios';
import { Dict } from './util';
import { Results } from './storages';

export class Remote {
  constructor(key: string, baseUrl: string) {
    this.key = key;
    this.baseUrl = baseUrl;
  }

  to(key: string): RemoteRecorder {
    const recorder: RemoteRecorder = new RemoteRecorder(key);
    this.recorders.push(recorder);
    return recorder;
  }

  async start(): Promise<void> {
    const data: any = {};
    this.recorders.forEach(recorder => data[recorder.key] = recorder);
    await axios.post(`${this.baseUrl}/start`, data);
  }
  async stop(): Promise<void> {
    await axios.post(`${this.baseUrl}/stop`);
  }

  async getResults(table: string): Promise<Results> {
    const response = await axios.get(`${this.baseUrl}/results/${table}`);
    if (response.data)
      return response.data;
    throw Error(`No ${table} results`);
  }

  readonly key: string;
  readonly recorders: Array<RemoteRecorder> = [];
  private readonly baseUrl: string;
}

export class RemoteRecorder {
  constructor(key: string) {
    this.key = key;
  }

  key: string;
  type: string = 'manual';
  period?: number;
  metrics: Dict<any> = {};

  periodically(period: number): RemoteRecorder {
    this.period = period;
    this.type = 'period';
    return this;
  }
  manually(): RemoteRecorder {
    this.type = 'manual';
    return this;
  }

  cpu(): RemoteRecorder {
    this.metrics['cpu'] = {type: 'cpu'};
    return this;
  }
  memory(): RemoteRecorder {
    this.metrics['memory'] = {type: 'memory'};
    return this;
  }
  timer(): RemoteRecorder {
    this.metrics['timer'] = {type: 'timer'};
    return this;
  }
}
