# Mini bulbthings

$$$ install
+ copy from repo
+ `$ npm i` 
+ `$ npm i -g gulp`

### before run
+ `$ ./scripts/createdb.sh`
+ generate md5 hash for valid company, like `$ echo -n DenisCompany | md5sum`

### run in development mode
+ `$ npm start`


### user api
+ Get all `$ curl -H "api-key: hash-key" localhost:3001/users/ -X GET`
+ Get by id `$ curl -H "api-key: hash-key" localhost:3001/users/1 -X GET`
+ Create user `$ curl -H "api-key: hash-key" localhost:3001/users/ -X POST -H "Content-Type:application/json" -d '{"first_name":"John","last_name":"Smith", "email": "john@smith.com"}'`
+ Update user `curl -H "api-key: hash-key" localhost:3001/users/1 -X PUT -H "Content-Type:application/json" -d '{"first_name":"John","last_name":"Smith", "email": "john@smith.com"}'`
+ Delete user `curl -H "api-key: hash-key" localhost:3001/users/2 -X DELETE`

### asset api
+ Get all `$ curl -H "api-key: hash-key" localhost:3001/assets/ -X GET`
+ Get by id `$ curl -H "api-key: hash-key" localhost:3001/assets/1 -X GET`
+ Create asset `$ curl -H "api-key: hash-key" localhost:3001/assets/ -X POST -H "Content-Type:application/json" -d '{"type":"Ipad","attributes": {"model": "iphone6", "os": "ios9"}}'`
+ Update asset `curl -H "api-key: hash-key" localhost:3001/assets/1 -X PUT -H "Content-Type:application/json" -d '{"type":"Ipad","attributes": {"model": "iphone7", "os": "ios9"}}'`
+ Delete asset `curl -H "api-key: hash-key" localhost:3001/assets/2 -X DELETE`