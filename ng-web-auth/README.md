# ng-web-auth

Web client Auth. application logic

## Install ng-common

```
git clone git@gitlab.project.com:project/packages/ng-common.git
cd ng-common
npm ci
npm link
```

## Install ng-web-auth

```
git clone git@gitlab.project.com:app/ng-web-auth.git
cd ng-web-auth
npm ci
npm link ng-common
vi src/app.js # correct baseURL of configApi
```

## Build

```
npm run build
npm link
```

## Development watch

`npm run watch`
