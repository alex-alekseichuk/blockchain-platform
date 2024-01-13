# ng-cli-tx


CLI tool for posting CREATE and TRANSFER tx

## Install from source locally

```
npm i
npm link
```

## Usage

Create a wallet:
```
project-tx wallet --configServer=http://localhost:3000/
```

Post CREATE tx:
```
project-tx create --amount=2 --description="Test tx"
project-tx create --amount=2 --description="Test tx" --configServer=http://localhost:3000/
```

Post CREATE tx and save it to file:
```
project-tx create --amount=3 --description=Test --out=./tx1.json
```

Post TRANSFER tx to specified by email account, use saved CREATE tx as a source:
```
project-tx transfer --email=user1@example.com --src=./tx1.json
project-tx transfer --email=user1@example.com --src=./tx-faa85b8ec0adfe63955216ac13ac154ccdd828b901a9fc074cd924b294e4e1b9.json

```

Get tx:
```
project-tx get --tx=518b99a3-33fa-44bf-87cf-d95f6c8e3328 --configServer=http://localhost:3000/
```

Listen tx:
```
project-tx listen --configServer=http://localhost:3000/
```



Use config from the server loaded via configApi:
```
project-tx create --configServer=http://localhost:8443/
```
