import Joi from 'joi';

export const makePost = Joi.object({
  title: Joi.string().min(3).message("Title must be at least 3 characters").required(),
  post: Joi.text().min(20).message("Post should have at least 20 characters").required()
})