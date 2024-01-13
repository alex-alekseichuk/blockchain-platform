## Web application for file uploading/downloading.

There are 2 modes of running/hosting this web application.
As a static HTTP resource under ng-rt-core with authentication. (full version)
and as a static HTTP resource under ng-rt-node without authentication,
because ng-rt-node has not authentication integrated in, yet (by 1 Mar 2020).
It needs to modify a bit the code to switch from one mode to another.

#### Locally host web application as static content of ng-rt-node

Without login, open url http://localhost:3000/

#### Locally host web application as static content of ng-rt-core
For test/dev flow we can sym-link the `dist` folder of web-app project into ng-rt-core folder with static HTTP resources.
So, we can use ng-rt-core both for authentication and as pure HTTP hosting for web application.
```
# link build of web app into static folder of ng-rt-code
ln -s /home/alex/Projects/project/ng-file-web/dist /home/alex/Projects/project/dev-3.0/server/middleware/img/app-file
```

Login, then open url http://localhost:8443/img/app-file/
