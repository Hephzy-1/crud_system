import Joi from 'joi';

export const makePost = Joi.object({
  title: Joi.string().min(3).message("Title must be at least 3 characters").required(),
  post: Joi.string().min(20).message("Post should have at least 20 characters").required(),
  userId: Joi.object()
});

export const userPost = Joi.object({
  id: Joi.string().alphanum()
})