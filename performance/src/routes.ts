/**
 * Performance HTTP API in the form of express routes.
 */
import { Controller } from './controller';
import { IStorage, MemoryStorage, Results } from './storages';
import { Recorder } from './recorders';

export function routes(httpServer: any) {
  let controller: Controller | null = null;
  let storage: IStorage | null = null;

  httpServer.post(`/perf/start`, async (req: any, res: any) => {
    if (controller)
      controller.stop();

    controller = buildController(req.body.recorders);
    controller.start();
    res.end();
  });

  httpServer.post(`/perf/stop`, async (req: any, res: any) => {
    if (!controller) {
      res.status(400).end();
      return;
    }

    controller.stop();
    storage = controller.storage;
    controller = null;
    res.end();
  });

  httpServer.get(`/perf/results/:table`, async (req: any, res: any) => {
    if (!storage) {
      res.status(400).end();
      return;
    }

    const results: Results = storage.getResults(req.params.table);
    res.json(results);
    res.end();
  });
}

function buildController(info: any): Controller {
  const controller: Controller = new Controller(new MemoryStorage());
  for (let key in info) {
    let recorderInfo = info[key];
    const recorder: Recorder = controller.to(recorderInfo.key);
    switch (recorderInfo.type) {
      case 'period':
        recorder.periodically(recorderInfo.period);
        buildMetrics(recorder, recorderInfo);
        break;
      case 'manual':
        recorder.manually();
        buildMetrics(recorder, recorderInfo);
        break;
    }
  }
  return controller;
}

function buildMetrics(recorder: Recorder, recorderInfo: any) {
  for (let metricKey in recorderInfo.metrics) {
    let metricInfo = recorderInfo.metrics[metricKey];
    switch (metricInfo.type) {
      case 'cpu':
        recorder.cpu();
        break;
      case 'memory':
        recorder.memory();
        break;
      case 'timer':
        recorder.timer();
        break;
    }
  }
}
