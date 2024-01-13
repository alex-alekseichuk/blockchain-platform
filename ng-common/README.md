# Build process

Branch    | Pipeline | Coverage
----------|----------|----------
Dev/2.0 :    | [![pipeline status](https://gitlab.project.com/packages/ng-common/badges/dev/2.0/pipeline.svg)](https://gitlab.project.com/packages/ng-common/commits/dev/2.0) | [![coverage report](https://gitlab.project.com/packages/ng-common/badges/dev/2.0/coverage.svg)](https://gitlab.project.com/packages/ng-common/commits/dev/2.0)
Cons/2.0 :    | [![pipeline status](https://gitlab.project.com/packages/ng-common/badges/cons/2.0/pipeline.svg)](https://gitlab.project.com/packages/ng-common/commits/cons/2.0) | [![coverage report](https://gitlab.project.com/packages/ng-common/badges/cons/2.0/coverage.svg)](https://gitlab.project.com/packages/ng-common/commits/cons/2.0)
Prod/2.0 :    | [![pipeline status](https://gitlab.project.com/packages/ng-common/badges/prod/2.0/pipeline.svg)](https://gitlab.project.com/packages/ng-common/commits/prod/2.0) | [![coverage report](https://gitlab.project.com/packages/ng-common/badges/prod/2.0/coverage.svg)](https://gitlab.project.com/packages/ng-common/commits/prod/2.0) 

# ng-common

Common JS code used both for client and for server side.
Both for nodejs and browser env.
See `index.js` for provided interfaces.

### Install dependencies

```
npm ci
```

### Layers:
- Application
- Framework
- Library

### Scopes:
- common
- nodejs
- browser


## 1. File service
This is a common code for working with upload and download files.
#### 1.1. API description

First of all you need call method fileService with two params like
`ngCommon.fileService({}, ajax)`

`config (Object)` - can be used in the future for conf data

`ajax (function)` - ajax for send http requests

it returns function with two methods, download and upload.

##### 1.1.1. upload

Upload part can be used for upload encrypted data with key, or without.

Let's create new object with the next params
```
const file = {
    key,
    content: self.file, // content
    size: self.filesize, // file size in bytes
    blocksCount: nBlocks // count of blocks for splitting
};
```
`key (string) - public key for encrypt content`

`content (string) - content`

`size (number) - size of file in bytes`

`blocksCount (number) - count of block for splitting`

Then call upload method, it returns promise with fileId and hash

`const { fileId, hash } = await fileService.upload(file, self.enableEncrypt);`

##### 1.1.2. download

First you need create download service. Call method download with 3 params. It returns promise.

`const downloadService = await fileService.download(KeysService, logger, enableCrypt);`

`keysService (function) - manager of keys`

`logger (function) - logger with debug, error, info`

`enableDecrypt (boolean) - is decrypt enabled or not`

then call getMeta with fileId which you want to download
```
await downloadService.getMeta(fileId);
```

then call getSecretSecret if you using encryption
```
await downloadService.getSecretSecret();
```

and finally you need to call download method. It returns metainfo about file, content, and hash of the file.
```
const { meta, content, hash } = await downloadService.download(); 
```

#### 1.2. examples
import in your project ng-common as dependency

```
"ng-common": "https://gitlab.project.com/packages/ng-common.git#dev/2.0"
```

then connect it
```
 script(src="${PATH}/node_modules/ng-common/lib/ng-common.js")
```

##### 1.2.1. upload

place this code with own params

```
const fileService = ngCommon.fileService({}, project.ajax);
const file = {
    key,
    content: self.file,
    size: self.filesize,
    blocksCount: nBlocks
  };
const { fileId, hash } = await fileService.upload(file, self.enableEncrypt);
```
##### 1.2.2. download

for download file you can use

```
const fileService = ngCommon.fileService({}, project.ajax);
const downloadService = await fileService.download(KeysService, self.logger, true);
await downloadService.getMeta(fileId);
await downloadService.getSecretSecret();
const { meta, content, hash } = await downloadService.download();
```
