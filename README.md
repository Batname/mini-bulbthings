# Mini bulbthings

$$$ install
+ copy from repo
+ npm i 
+ npm i -g gulp

### before run
+ $ ./scripts/createdb.sh
+ generate md5 hash for valid company, like `$ echo -n DenisCompany | md5sum`


### api usage
+ users
Get all `$ curl -H "api-key: hash-key" localhost:3001/users/ -X GET`
Get by id `$ curl -H "api-key: hash-key" localhost:3001/users/1 -X GET`
Create user `$ curl -H "api-key: hash-key" localhost:3001/users/ -X POST -H "Content-Type:application/json" -d '{"first_name":"John","last_name":"Smith", "email": "john@smith.com"}'`
Update user `curl -H "api-key: hash-key" localhost:3001/users/1 -X PUT -H "Content-Type:application/json" -d '{"first_name":"John","last_name":"Smith", "email": "john@smith.com"}`
Delete user `curl -H "api-key: hash-key" localhost:3001/users/2 -X DELETE`