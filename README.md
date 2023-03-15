# Short Url Server
A simple web server to generate short url of an url.
User can create/view the links and their view times.
Client side please see [here](https://github.com/chitsutote/short-url-front-end)
# Environment
- node: 16.4.2
- yarn: 1.22.19
- docker: 20.10.22

# Installation
run command `yarn` to install dependencies

# How to run
1. set up database and redis
```
./scripts/start-docker.sh
```
2. After docker container is ready, start the app
```
yarn start
```


# File Structure
```
src
 ┣ config
 ┃ ┗ index.ts
 ┣ dataSource # Data source instance
 ┃ ┣ appDataSource.ts
 ┃ ┗ redisSource.ts
 ┣ modules # group by module, contains its entity, controller, middleware
 ┃ ┣ auth 
 ┃ ┗ short-url
 ┣ service # 3rd party service
 ┃ ┗ jwtService.ts
 ┣ utils
 ┃ ┗ random.ts
 ┣ app.ts
 ┣ root.controller.ts # handle short url redirect
 ┣ routes.ts  # aggregate all routes
 ┗ server.ts
 ```