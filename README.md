
# Console


### Overview

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
Create React App documentation:
https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment


## Getting Started
### Environment variables
- **API_URL** (string, required) - the API Url that Console will use to make requests to API to retrieve data.
  1) Local: `http://fd-dev.com:8090`
  2) CI: `http://ci-api.flightdeckdata.com`
- **GOOGLE_CLIENT_ID** (string, required) - the application's google client id
- **ENV_NAME** (string, required, options: ['LOCAL', 'CI', 'PROD']) - the environment name
- **LOG_FORMAT** (string, options: ['json', 'delimited']) - the client-side log format

### Running Console
Run the following command:

- `yarn install`
- `yarn start`

### Deploying Console
The build process will generate bundled and minified static assets here: `/build`. The deployment process will run `npm start` to start up a node server that will return `index.html` with the following route `/*`. `index.html` references the static js/css asset files that were generated from the build process.

Run these commands to deploy Console:
- `npm run deploy`
- `docker tag <image-id>:<version>`
- `cd deploy`
- `kubectl apply -f console/<environment>/deployment.yml`
