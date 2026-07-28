import Joi from "joi";

export const planDateValidate = Joi.object({
  date: Joi.string().valid("YYYY-MM-DD").trim(),
});

export const updateValidator = Joi.object({
  taskId: Joi.string().hex().length(24).required().trim(),
  update: {
    title: Joi.string().optional().min(3).trim(),
    description: Joi.string().optional().min(10).trim(),
    time: Joi.string().optional().trim(),
  },
});
export const taskIdValidator = Joi.string().hex().length(24).required().trim();

export const taskValidator = Joi.object({
  title: Joi.string().required().min(3).trim(),
  description: Joi.string().required().min(10).trim(),
  time: Joi.string()
    .required()
    .pattern(/^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$/)
    .messages({
      "string.pattern.base": "Time must be in 12-hour format like 1:30 PM",
      "string.empty": "Time is required",
    }),
});
