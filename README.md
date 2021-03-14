# amg-katalog-api

## Table of content

- [End point](#end-point)
  - [End point parameter](#end-point-parameter)
    - [End point system](#end-point-system)
  - [End point master](#end-point-master)
    - [End point user](#end-point-user)

## End point

This end point for access rest api.

### End point parameter

#### End point system

* Get data system :
  ```js
  Methode: GET
  URL: http://{host}:3753/api/system-perusahaan
  Header: 
    Content-Type = application/json
  Body:
  ```

### End point master

#### End point user

This is end point for all access to data customer.

##### Login user

Login for user to system, use this end point for login to system.

* Login user with user_id : 
  ```js
  Methode: POST
  URL: http://{host}:3753/api/user/login-user
  Header: 
    Content-Type = application/json
  Body:
    {
      "user_id": "<user_id>",
      "password": "<password>"
    }
  ```

##### Get Data User

For get all data user check this end point.

* Get data user : 
  ```js
  Methode: GET
  URL: http://{host}:3753/api/user/
  Header: 
    Content-Type = application/json
    x-auth-token = <your token>
  Body:
  ```

##### Create User

For create new data user.

* Create data user :
  ```js
  Methode: POST
  URL: http://{host}:3753/api/user/
  Header: 
    Content-Type = application/json
    x-auth-token = <your token>
  Body:
    {
      "user_id": "<user_id>",
      "nama_lkp": "<nama_lkp>",
      "type": "type_user",
      "password": "<password>",
      "retype_password": "<retype_password>"
    }
  ```

##### Edit Data User

For edit data user.

* Edit data user :
  ```js
  Methode: PUT
  URL: http://{host}:3753/api/user/1/:user_id
  Header: 
    Content-Type = application/json
    x-auth-token = <your token>
  Body:
    {
      "nama_lkp": "<nama_lkp>",
      "type": "type_user",
    }
  ```

##### Delete Data User

For delete data user.

* Delete data user :
  ```js
  Methode: DELETE
  URL: http://{host}:3753/api/user/1/:user_id
  Header: 
    Content-Type = application/json
    x-auth-token = <your token>
  Body:
  ```