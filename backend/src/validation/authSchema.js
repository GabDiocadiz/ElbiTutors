import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('tutee', 'tutor').default('tutee'),
  degree_program: Joi.string().optional(),
  classification: Joi.string().optional(),
  student_number: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const googleLoginSchema = Joi.object({
  credential: Joi.string().optional(),
  idToken: Joi.string().optional(),
  degree_program: Joi.string().optional(),
  classification: Joi.string().optional(),
  student_number: Joi.string().optional(),
}).or('credential', 'idToken'); // Require at least one
