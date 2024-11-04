import Joi from 'joi';

export const makePost = Joi.object({
  title: Joi.string().min(3).message("Title must be at least 3 characters").required(),
  post: Joi.string().min(20).message("Post should have at least 20 characters").required(),
  userId: Joi.string().required(),

  // Custom validation for `coverImage` to check MIME type and file size
  coverImage: Joi.any()
    .custom((value, helpers) => {
      const file = helpers.state.ancestors[0].file;
      
      if (!file) {
        return helpers.error("any.required");
      }
      
      // Check file type
      if (!file.mimetype.startsWith("image/")) {
        return helpers.error("file.invalid", { message: "File must be an image" });
      }

      // Check file size (e.g., max 5MB)
      const MAX_SIZE = 16 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return helpers.error("file.max", { message: "File must be less than 5MB" });
      }

      return value;
    })
    .messages({
      "any.required": "Cover image is required",
      "file.invalid": "Only image files are allowed",
      "file.max": "Image size should be less than 5MB",
    }),
});


export const userPost = Joi.object({
  id: Joi.string().alphanum()
});

export const updatePost = Joi.object({
  post: Joi.string().min(20).message("Post must be at least 20 characters").required()
})