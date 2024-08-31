const express = require('express');

const graphRoute = express.Router();

const graphController = require('../controllers/graph.controller');
const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const graphValidation = require('../validations/graph.validation');

graphRoute.put('/:userId/followOrUnfollow/:followedId', auth, validate(graphValidation.followOrUnfollow), graphController.followOrUnfollow);

module.exports = graphRoute;