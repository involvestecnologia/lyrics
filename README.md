# lyrics

[![Build Status](https://travis-ci.org/involvestecnologia/lyrics.svg?branch=master)](https://travis-ci.org/involvestecnologia/lyrics)
[![Code Climate](https://codeclimate.com/github/involvestecnologia/lyrics/badges/gpa.svg)](https://codeclimate.com/github/involvestecnologia/lyrics)
[![Test Coverage](https://codeclimate.com/github/involvestecnologia/lyrics/badges/coverage.svg)](https://codeclimate.com/github/involvestecnologia/lyrics/coverage)

Setup
-----
```bash
$ git clone git@github.com:involvestecnologia/lyrics.git
$ cd lyrics
$ yarn install
```

Development
-----------
* nodemon
  ```bash
  $ yarn start
  ```
* debug
  ```bash
  $ node --inspect=${DEBUG_PORT} ./bin/www
  ```

Production
----------
* docker
  ```bash
    $ docker-compose up .
  ```
* pm2
  ```bash
    $ npm install pm2 -g
    $ pm2 start ./bin/www
  ```
