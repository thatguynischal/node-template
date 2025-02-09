import Joi from "joi";

export const createSubscriptionSchema = Joi.object({
    userId: Joi.string().required(),
    eventType: Joi.string().required(),
});