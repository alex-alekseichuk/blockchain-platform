Simple web application
- to get login/password from user,
- then check it against LDAP,
- then generate JWT token and place it into Cookie

It's used by nginx http server for authentication.
It's implemented by express.

#### Env. vars.:

- `TITLE` default is `Project Playground Login`
- `LDAP_URL` default is `ldap://127.0.0.1:389`
- `BIND_CN` default is `cn=admin,dc=project,dc=com`
- `BIND_PASSWD` default is ... you know ...
- `BASE_DN` default is `ou=Users,dc=example,dc=org`
- `GROUP_CN` default is `playground-gke,ou=groups,dc=project,dc=com`
- `EXPIRE` token/cookie expiration in minutes default is `1800` 30 hours
- `JWT_SECRET` default is `nginx123`
- `COOKIE_NAME` default is `nginxauthjwt`

Exposed HTTP port is 8080.

```
// get docker image from project registry in gitlab
// you need to login into it first
docker pull registry.project.com/ng-rt-internal/ng-rt/nginx-ldap-cookie
docker run -it --name auth -p 3000:8080 registry.project.com/ng-rt-internal/ng-rt/nginx-ldap-cookie
```

```
// build and push docker image into project registry in gitlab
docker build -t registry.project.com/ng-rt-internal/ng-rt/nginx-ldap-cookie .
docker push registry.project.com/ng-rt-internal/ng-rt/nginx-ldap-cookie
```

