<p align="center">
  <a href="#">
    <img src="https://github.com/involvestecnologia/lyrics/blob/master/media/logo.png" alt="Lyrics" />
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

Google Translate
-----
Follow this link so you can setup google translate into your enviroment: https://cloud.google.com/translate/docs/

Google Cloud Translate API needs some steps to work:
- Google cloud project
- Enable billing to your project (you will need an billing account and a credit card. Also, they won't charge you when your free use is done)
- Enable Google Cloud Translate API into your project
- Get credentials from the api

All this can be found here:

https://cloud.google.com/translate/docs/getting-started
https://cloud.google.com/translate/docs/reference/libraries
https://cloud.google.com/translate/docs/quickstart-client-libraries

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
