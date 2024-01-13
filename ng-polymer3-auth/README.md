# ng-polymer3-auth

Auth. SPA implementation with UI based on Polymer3

## Install

```
npm i -g polymer-cli
git clone git@gitlab.project.com:app/ng-polymer3-auth.git
cd ng-polymer3-auth
npm i
npm link ng-web-auth
```

## Build

`polymer build`

## Run Develop instance

`polymer serve`
`polymer serve --hostname 0.0.0.0`

## Develop SPA logic module

Clone 2 projects and link one into another.

```
cd ../ng-web-auth
npm link
npm run watch
cd ../ng-polymer3-auth
npm i
rm -rf node_modules/ng-web-auth
npm link ng-web-auth
polymer serve --open
```

Now, change either ng-web-auth or ng-polymer3-auth, and refresh page.
