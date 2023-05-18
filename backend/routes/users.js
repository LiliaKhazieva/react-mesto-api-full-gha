const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');
const {
  getUsers, getUser, getCurrentUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);// all users
userRouter.get('/me', getCurrentUser);// current user
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);// id user

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUserInfo);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .required()
      .pattern(URL_REGEX),
  }),
}), changeUserAvatar);

module.exports = userRouter;
