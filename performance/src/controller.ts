/**
 * Performance testing framework
 */
import { IStorage, Results } from './storages';
import { Dict } from './util';
import {
  Recorder
} from './recorders';
import { Remote, RemoteRecorder } from './remote';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export interface IController {
  start(): Promise<void>;
  stop(): Promise<void>;
  storage: IStorage;
}

export class Controller {
  constructor(storage: IStorage) {
    this.storage = storage;
  }

  to(key: string): Recorder {
    const recorder: Recorder = new Recorder(this, key);
    this.recorders.push(recorder);
    return recorder;
  }

  remote(key: string, baseUrl: string): Remote {
    const remote: Remote = new Remote(key, baseUrl);
    this.remotes[key] = remote;
    return remote;
  }

  async start(): Promise<void> {
    await Promise.all(this.recorders.map((recorder: Recorder) => recorder.start())
      .concat(Object.values(this.remotes).map(remote => remote.start())));
  }
  async stop(): Promise<void> {
    await Promise.all(this.recorders.map(recorder => recorder.stop())
      .concat(Object.values(this.remotes).map(remote => remote.stop())));
  }

  async saveCsv(prefix: string) {
    // save remotes
    for (let key in this.remotes) {
      const remote: Remote = this.remotes[key];
      await Promise.all(remote.recorders.map((recorder: RemoteRecorder) => remote.getResults(recorder.key)
        .then(results => this._saveCsv(`${prefix}${remote.key}-${recorder.key}.csv`, results))));
    }

    // save local ones
    await Promise.all(this.recorders.map((recorder: Recorder) =>
      this._saveCsv(`${prefix}${recorder.key}.csv`, this.storage.getResults(recorder.key))));
  }


  private async _saveCsv(path: string, results: Results) {
    const c = this;
    const header = Object.keys(results[0]).map(key => ({id: key, title: c.labels[key] || key}));
    const csvWriter = createCsvWriter({path, header});
    await csvWriter.writeRecords(results);
  }

  storage: IStorage;
  readonly recorders: Array<Recorder> = [];
  readonly remotes: Dict<Remote> = {};

  readonly labels: Dict<string> = {
    timestamp: 'timestamp (ms)',
    started: 'started (ms)',
    finished: 'finished (ms)',
    timer: 'timer (ms)',
    memory: 'memory (M)'
  };
}
