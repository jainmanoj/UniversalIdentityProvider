
const serialize = require('serialize-javascript');

exports.renderView = function (viewName, viewParams) {

  const viewData = {
    view : viewName,
    params : viewParams
  }

  const viewStr = 
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>React App</title>
      <link rel="stylesheet" href="/authn/css/style.css">
    </head>
    <body>
      <div id="react-app"></div>
      <script>window.__INITIAL_DATA__ = ${serialize(viewData)}</script>
      <script src="/authn/js/app.js"></script>
    </body>
  </html>`;

  // console.log(`${viewStr} `);
  return viewStr;
};