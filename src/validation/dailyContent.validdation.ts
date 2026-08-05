import Joi from "joi";

export const createDailyContentValidation = Joi.object({
  type: Joi.string()
    .valid("quran", "hadith", "reflection", "article")
    .required(),

  title: Joi.string().trim().required(),

  content: Joi.string().trim().required(),

  source: Joi.string().trim().allow("").optional(),

  language: Joi.string().trim().default("en"),

  active: Joi.boolean().default(true),
});

export const updateDailyContentValidation = Joi.object({
  type: Joi.string().valid("quran", "hadith", "reflection", "article"),

  title: Joi.string().trim(),

  content: Joi.string().trim(),

  source: Joi.string().trim().allow(""),

  language: Joi.string().trim(),

  active: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update.",
  });
