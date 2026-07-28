import Joi from "joi";

export const PreReg = Joi.object({
  firstName: Joi.string().required().max(20).min(3).trim(),
  lastName: Joi.string().required().max(20).min(3).trim(),
  email: Joi.string().required().email().trim(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/,
    )
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 8 characters",
    })
    .required(),
});

export const register = Joi.object({
  email: Joi.string().email().required().trim(),
  otp: Joi.string().length(6).required(),
});

export const login = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required().min(8),
});
export const mailValid = Joi.object({
  email: Joi.string().email().required().trim(),
});

export const resetValid = Joi.object({
  email: Joi.string().email().required().trim(),
  otp: Joi.string().length(6).required(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/,
    )
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 8 characters",
    })
    .required(),
  confirmPassword: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/,
    )
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 8 characters",
    })
    .required(),
});

export const userAiValid = Joi.object({
  lifeStage: Joi.string()
    .required()
    .valid(
      "student",
      "workingProfessional",
      "entrepreneur",
      "stayAtHome",
      "other",
    ),
  deenGoals: Joi.array()
    .required()
    .items(
      Joi.string().valid(
        "salahConsistency",
        "quranReading",
        "quranMemorization",
        "dhikr",
        "duas",
        "character",
        "knowledge",
        "timeManagement",
        "spiritualConsistency",
      ),
    )
    .min(1),
});

export const planDateValidate = Joi.object({
  date: Joi.string().valid("YYYY-MM-DD").trim(),
});
