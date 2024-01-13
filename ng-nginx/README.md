# ng-nginx

Web client platform provides:

- development environment
- deployment
- docker

### Requirements
- git
- docker

### Install
```
npm i -g git+ssh://git@gitlab.project.com:ng_rt/ng-nginx.git
```
After installation **project-nginx** CLI tool is available.

### Common flows

#### Create web-client solution:
```
project-nginx init
project-nginx addRepo ...
```
Then save *frontend-config.json* for further development and deployment.

#### Develop web-client application within a solution:

Get *frontend-config.json* file.
Put application in form of proxy or local folder for development:
```
project-nginx addFolder ...
project-nginx addProxy ...
```

Then run local container with nginx:
```
project-nginx run
```
Then go to *http://localhost*

#### Build a docker image of solution:
Get *frontend-config.json* file.
```
project-nginx pull
project-nginx build
```
Then upload/save *project-frontend* docker image.

### Commands

Init empty config *frontend-config.json*:
```
project-nginx init
```

Init specific config file:
```
project-nginx init --config=./local.json
```

Add application from git repository:
```
project-nginx addProxy --name=app-login \
    --url=git@gitlab.project.com:app/ng-polymer3-auth.git \
    --branch=dev/2.0 \
    --path=build/default
```

Add proxy to development HTTP server of specific application:
```
project-nginx addProxy --name=app-login --url=http://172.17.0.1:8081
project-nginx addProxy --name=app-login --url=http://192.168.3.107:8081
```

Add application as a local static folder:
```
project-nginx addFolder --name=app-login --path=$PROJECT/ng-polymer3-auth/build/default
```

Remove application (repo, proxy or folder):
```
project-nginx remove --name=app-auth
```

Run docker container with nginx locally:
```
project-nginx run
project-nginx run --port=8080 --name=container1
```

Stop docker container:
```
project-nginx stop
```

Restart docker container:
```
project-nginx restart
```

Pull all *repo* application from git into local *./repos/* dir:
```
project-nginx pull
```

Build docker image, *project-frontend* by default:
```
project-nginx build
project-nginx build --name=image1 --config=local.json
```

Run nginx web client solution in docker container:
```
docker run --name=project-frontend \
    -e CORE_URL=http://192.168.3.107:8443 \
    -e CONFIG_BASE_URL=http://192.168.3.107 \
    -p 80:80 \
    -d project-frontend
```

### Files

- **frontend-config.json** is configuration of the instance
- **nginx.json.mustashe** is the template to generate nginx.conf
- **nginx.json** is actual nginx config
- **repos/** are pulled git repositories to be included as applications

