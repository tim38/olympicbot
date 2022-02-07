/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = app => {
  // parse cookies
  app.use(cookieParser());

  app.set('view engine', 'html');

  // handle URLencoded and json params
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '40mb'
    })
  );
  app.use(
    bodyParser.json({
      limit: '40mb'
    })
  );

  // if we aren't in production we will use
  // webpack dev middleware for dev server
  if (process.env.NODE_ENV !== 'production') {
    const webpackConfig = require('../webpack.config.js')(); // eslint-disable-line
    const webpackCompiler = webpack(webpackConfig);

    app.use(
      webpackDevMiddleware(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath
      })
    );
  } else {
    app.use(express.static(path.resolve(__dirname, '..', 'dist')));
  }
};
