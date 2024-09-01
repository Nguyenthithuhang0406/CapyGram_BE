const express = require('express');

const graphRoute = express.Router();

const graphController = require('../controllers/graph.controller');
const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const graphValidation = require('../validations/graph.validation');

graphRoute.put('/:userId/followOrUnfollow/:followedId', auth, validate(graphValidation.followOrUnfollow), graphController.followOrUnfollow);
graphRoute.get('/:userId/countFollowers', auth, validate(graphValidation.getCountFollowers), graphController.getCountFollowers);
graphRoute.get('/:userId/countFollowings', auth, validate(graphValidation.getCountFollowings), graphController.getCountFollowings);
graphRoute.get('/:userId/followers', auth, validate(graphValidation.getFollowers), graphController.getFollowers);
graphRoute.get('/:userId/followings', auth, validate(graphValidation.getFollowings), graphController.getFollowings);

module.exports = graphRoute;