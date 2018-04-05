const express = require('express');
const path = require('path');
const app = express();
const analyticsScripts = "<script>" +
  '!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";'
  + 'analytics.load("vmzNDi4AApsec3GhlWwqoEJCPRQkWTQj"); analytics.page(); }}(); </script>';

app.use(express.static(path.join(__dirname, '')));

function writeSettings() {
  const fs = require('fs');
  const indexFile = path.join(__dirname, '', 'index.html');
  console.log('Writing settings to file: ' + indexFile);
  fs.readFile(indexFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    let result = data.replace("%GOOGLE_CLIENT_ID%", process.env.GOOGLE_CLIENT_ID);
    result = result.replace("%API_URL%", process.env.API_URL);
    result = result.replace('%ENV_NAME%', process.env.ENV_NAME);
    result = result.replace('%LOG_FORMAT%', process.env.LOG_FORMAT);
    if (process.env.ENV_NAME.toLowerCase() === 'prod') {
      result = result.replace('%ANALYTICS_SCRIPTS%', analyticsScripts);
    }
    else {
      result = result.replace('%ANALYTICS_SCRIPTS%', '');
    }

    console.log('Writing html with injected settings');

    fs.writeFile(indexFile, result, 'utf8', function (err) {
       if (err) return console.log(err);

       console.log('Html written to file successfully');
    });
  });
}

writeSettings();

app.get('/settings', function (req, res) {
  console.log('/settings endpoint hit');
  var apiUrl = process.env.API_URL;
  var googleClientId = process.env.GOOGLE_CLIENT_ID;
  res.json({apiUrl: apiUrl, googleClientId: googleClientId});
});

app.get('/*', function (req, res) {
  console.log('/* endpoint hit');
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

const port = 3000;
console.log('Server listening on port ' + port);
app.listen(port);
