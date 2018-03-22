<p align="center">
  <a href="#">
    <img src="https://github.com/involvestecnologia/lyrics/blob/master/media/logo.jpg" alt="Lyrics" />
  </a>

  <h3 align="center">Lyrics</h3>

  <p align="center">
    A tool to automate machine translation from Loco projects.
  </p>
</p>

## Status

[![Build Status](https://travis-ci.org/involvestecnologia/lyrics.svg?branch=master)](https://travis-ci.org/involvestecnologia/lyrics)
[![Code Climate](https://codeclimate.com/github/involvestecnologia/lyrics/badges/gpa.svg)](https://codeclimate.com/github/involvestecnologia/lyrics)
[![Test Coverage](https://codeclimate.com/github/involvestecnologia/lyrics/badges/coverage.svg)](https://codeclimate.com/github/involvestecnologia/lyrics/coverage)

## Getting Started

This tool aims to automate the flow of machine translation of new terms on the Loco TMS (https://localise.biz/). 
Automated translation of terms/assets/resources/messages is often required in order to avoid slow down deliveries due to untranslated terms, this tool was developed to do this work, helping the customers to have a better experience using your software while the new terms are waiting to be translated by a human translator.

## The Translation Flow

![The Translation Flow](https://github.com/involvestecnologia/lyrics/blob/master/media/flow.png)

## Using a glossary

//TODO 

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
