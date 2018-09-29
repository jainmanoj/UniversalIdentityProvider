const renderEngine = require('./renderEngine');

// GET /viewApis/messages/public
exports.testEngineViews = function (req, res, next) {
    const view = 'TestPage';
    const params = { name: 'Manoj Kumar Jain'};
    const viewStr=renderEngine.renderView(view ,params);
    // console.log("Engine View str " + viewStr);
    // req.url = '/view/TestPage';
    res.send(viewStr);
};