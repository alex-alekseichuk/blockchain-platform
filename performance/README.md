# Performance tests


Create TX test

```
npx ts-node src/test/createTx.ts --concurrent=5 --perThread=5
```

Transfer TX test

```
npx ts-node src/test/transferTx.ts --concurrent=5 --perThread=5
```

Listen TX test

```
npx ts-node src/test/listenTx.ts --concurrent=5 --perThread=5 --listeners=10 --websocket
```

Wait for TX test

```
npx ts-node src/test/waitTx.ts --concurrent=5 --perThread=5 --websocket
```

Test example

```
npx ts-node src/test/sample.ts
```

Run the test and save output/plots to the file

```
npx ts-node src/test/sample.ts > plots.tx
```

Draw plot by saved results

```
npx ts-node src/plot.ts --file=./sample-server1-usage.csv --column=cpu
```

## Tests


## Repeat test (DOESN'T WORK ANYMORE!)

* Simple repeater CLI tool to run da-sdk-samples a lot of times simultaneously as a load-test.
* The test means to run a session of `num` steps.
* On each step we increase the `concurrent` number of the parallel threads/workers.
* Each thread runs the sample `perThread` times.
* There is only time of run metric.

### Single run

```
npm repeat -- --sample=createAsset
```

### Run session

- 20 steps
- from 3 threads +1 thread each step
- 2 times per thread on each step
- output result to csv file
- draw a chart in console

```
npm repeat -- --sample=createAsset -n 20 -c 3 -d 1 -t 2 --plot --csv=./output.csv
```
