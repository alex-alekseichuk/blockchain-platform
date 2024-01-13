# ng-web-tx

Demo transaction application. Post CREATE tx, then post TRANSFER tx based on previous one.

CLI `npm run ...` to use:
```
  "scripts": {
    "build": "webpack --mode production",
    "watch": "webpack --watch --mode development",
    "start": "webpack-dev-server --open --mode development"
  },
```

Sym-link `dist/` to `ng-web-tx/` as sub folder of static of `ng-rt-node`.
Then run `ng-rt-node`.

Open in browser:
```
http://localhost:3000/ng-web-tx/
```

## ng-rt-admin route?
```
{
    "type" : "href",
    "route" : "ng-tx-create",
    "href" : "iframe/ng-tx-create/http%3A%2F%2F192.168.3.107%2Fapp-tx%2F%23%21%2Fcreate%2F",
    "icon" : "icons:file-upload",
    "caption" : "Create TX",
    "roles" : [
        "user"
    ],
    "module" : "admin",
    "profile" : false,
    "trustLevel" : 1,
    "order" : 1300
}
```

```
{
    "type" : "href",
    "route" : "ng-tx-transfer",
    "href" : "iframe/ng-tx-transfer/http%3A%2F%2F192.168.3.107%2Fapp-tx%2F%23%21%2Ftransfer%2F",
    "icon" : "icons:file-upload",
    "caption" : "Transfer TX",
    "roles" : [
        "user"
    ],
    "module" : "admin",
    "profile" : false,
    "trustLevel" : 1,
    "order" : 1300
}
```
