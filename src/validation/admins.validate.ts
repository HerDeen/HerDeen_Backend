import Joi from "joi";

export const adminReg = Joi.object({
  firstName: Joi.string().required().max(20).min(3).trim(),
  lastName: Joi.string().required().max(20).min(3).trim(),
  userName: Joi.string().optional().max(10).trim(),
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

export const adminLogin = Joi.object({
  email: Joi.string().required().email().trim(),
  password: Joi.string().required().min(8),
});

export const resetPwd = Joi.object({
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
export const emailValid = Joi.object({
  email: Joi.string().email().required().trim(),
});

export const changePwd = Joi.object({
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
