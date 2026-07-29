import Joi from "joi";

export const ibadahTrackerValidation = Joi.string()
  .required()
  .valid("fajr", "dhuhr", "asr", "maghrib", "isha");
