
const express = require('express');

const router = express.Router();

const samlController = require('./samlController');

// GET /saml/metadata
router.get('/metadata', samlController.getSAMLSPMetaData);

// GET /saml/login
router.get('/login', samlController.samlLoginCtrl);

// // GET /saml/assertion
router.post('/assertion', samlController.samlAssertion);


module.exports = router;
