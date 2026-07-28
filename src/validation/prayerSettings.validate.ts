import Joi from "joi";

export const validatePrayerSettings = Joi.object({
  remindersEnabled: Joi.boolean(),
  reminderBefore: Joi.number().min(0).max(60),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  timezone: Joi.string(),
  calculationMethod: Joi.string().valid(
    "MuslimWorldLeague",
    "Egyptian",
    "Karachi",
    "UmmAlQura",
  ),
  madhab: Joi.string().valid("Shafi", "Hanafi"),
});
