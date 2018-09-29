// const CircularJSON = require('circular-json');

// GET /api/messages/public1
exports.getPublicMessage = function (req, res, next) {
  return res.json({
    message: 'public get message  from /api/messages/public',
  });
};

exports.postPublicMessage = function (req, res, next) {
  return res.json({
    request: `${JSON.stringify(req.method,null,4)}  ${JSON.stringify(req.url,null,4)} ${JSON.stringify(req.headers,null,4)}`,
    response: `${JSON.stringify(req.body,null,4)}`,
  });
};

// GET /api/apicallback
exports.apicallback = function (req, res, next) {
  return res.json({
    request: `${req.method}  ${req.url} ${req.headers}`,
    response: `${res.headers} ${req.body}`,

  });
};
