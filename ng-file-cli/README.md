## CLI tools to upload and download files.

#### Install from source
```
npm i
npm link
```

It can be used in 2 modes:
1. against ng-rt-core (full mode) with authentication.
2. against ng-rr-node without authentication because auth. is not supported yet by ng-rt-node.

#### Upload examples

```
node upload.js --configServer=http://localhost:8443/ -i picture1.jpg
node upload.js --configServer=http://localhost:3000/ -i picture1.jpg
node upload.js --configServer=http://localhost:3000/ -i README.md
node upload.js --configServer=http://192.168.3.107:3000/ -i README.md
node upload.js --configServer=http://localhost:3000/ -i README.md \
    --key=17ff7dd91c5dc096b49af267663b99d9e2ffc275f1ce6c43732d4252a90681ca
```

#### Download examples

```
node download.js --configServer=http://localhost:8443/ --fileId=1cc83c6d-c46c-4625-aed7-12569595022b -o picture2.jpg
node download.js --configServer=http://localhost:3000/ --fileId=eb9f67e8-c9fd-49ff-ae68-3054e08174bd -o 1.md
node download.js --configServer=http://192.168.3.107:3000/ --fileId=1399e099-7059-4673-ad8b-75cd96bd17fb -o 1.md
node download.js --configServer=http://192.168.3.107:3000/ --fileId=44bd4873-5203-4e53-8f28-b0ca95cc64c5 -o pic.jpg
node download.js --configServer=http://192.168.3.107:3000/ --fileId=ef73276e-030e-42a3-ae3f-aec3dd4cfe59 -o pic.jpg \
    --key=17ff7dd91c5dc096b49af267663b99d9e2ffc275f1ce6c43732d4252a90681ca
node download.js --configServer=http://localhost:8443// --fileId=4551bf49-3bfc-4a6f-a168-f96f39f3384c -o pic.jpg \
    --key=519d513552478a9e46c80de88f8ebf1105125ab796da899b73918d5148127c16
```

#### TODO:

add options:

- -i stdin
- -o stdout
- -u admin
- -p some-passwd
- authentication via SSH
