import Joi from "joi";

export const createMenstrualLogValidation = Joi.object({
  lastFlowDate: Joi.date().required(),

  averageFlowDuration: Joi.number().integer().min(1).max(10).required(),

  cycleLength: Joi.number().integer().min(21).max(45).required(),

  useStandardCycle: Joi.boolean().required(),

  quranGoalDuringPeriod: Joi.number().integer().min(0).required(),

  memorizationFrequency: Joi.string()
    .valid("daily", "weekly", "occasionally")
    .required(),

  reminderPreference: Joi.object({
    spiritualEncouragement: Joi.boolean().required(),
    restReminder: Joi.boolean().required(),
    disableIbadahReminders: Joi.boolean().required(),
  }).required(),
});

export const updateMenstrualLogValidation = Joi.object({
  lastFlowDate: Joi.date(),

  averageFlowDuration: Joi.number().integer().min(1).max(10),

  cycleLength: Joi.number().integer().min(21).max(45),

  useStandardCycle: Joi.boolean(),

  quranGoalDuringPeriod: Joi.number().integer().min(0),

  memorizationFrequency: Joi.string().valid("daily", "weekly", "occasionally"),

  reminderPreference: Joi.object({
    spiritualEncouragement: Joi.boolean(),
    restReminder: Joi.boolean(),
    disableIbadahReminders: Joi.boolean(),
  }),
}).min(1);
