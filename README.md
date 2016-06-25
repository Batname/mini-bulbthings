# Mini bulbthings

### install
+ copy from repo
+ Install last version node.js
+ Install and run postgresql, like `$ brew install postrgesql` for mac
+ Install all node modules `$ npm i` 

### before run
+ `$ ./scripts/createdb.sh`
+ generate md5 hash for valid company, like `$ echo -n bulbthings | md5sum`
+ Test api key for bulbthings is `8529aeb40814f72cf9238fb9c2e74142`

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

### allocation api
+ Allocate asset to user, Dates in ISO 8601 format `$ curl -H "api-key: hash-key" localhost:3001/allocations/ -X POST -H "Content-Type:application/json" -d '{"user_id":1, "asset_id": 1, "start": "2016-08-30", "finish": "2016-09-30"}'`
+ Update allocation `curl -H "api-key: api-key" localhost:3001/allocations/1 -X PUT -H "Content-Type:application/json" -d '{"start": "2016-10-08", "finish": "2016-10-09"}'`
+ Delete allocation `curl -H "api-key: hash-key" localhost:3001/allocations/1 -X DELETE`
+ Filter for certain user `$ curl -H "api-key: hash-key" localhost:3001/allocations/user/1/ -X GET`
+ Filter for certain asset `$ curl -H "api-key: hash-key" localhost:3001/allocations/asset/1/ -X GET`
+ List of currently assigned assets `curl -H "api-key: hash-key" localhost:3001/allocations/assigned -X GET`

### tests
+ Run tests `$ npm test`