const express = require('express');
const router = express.Router();
const graphMain = require('./../graphql/main')

router.post('/', function (req, res, next) {
    const query = req.param('query');
    new Promise((resolve) => {
        graphMain(query).then(resolve)
    }).then(data => {
        res.send(data)
    });
});

module.exports = router;
