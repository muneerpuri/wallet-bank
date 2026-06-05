/**
 * @file utils/schemas.js
 * @description This module contains Joi validation schemas for validating user input during login and registration.
 * It uses Joi to define and enforce structure and required fields for the `login` and `register` operations.
 *
 * @module schemas
 */

import Joi from 'joi';

/**
 * Validation schema for the login request body.
 * Ensures that the email is a valid string formatted as an email and that the password is a non-empty string.
 *
 * @constant {object} loginSchema - The Joi validation schema for validating user login input.
 *
 * @example
 * // Example of validating login data
 * const { error } = loginSchema.validate({ email: 'user@example.com', password: 'password123' });
 * if (error) {
 *   console.log(error.details[0].message); // Error message if validation fails
 * }
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(), // Valid email address, required field
  password: Joi.string().required(), // Non-empty password, required field
});

/**
 * Validation schema for the registration request body.
 * Ensures that the name is a non-empty string, email is valid, and password is provided.
 *
 * @constant {object} registerSchema - The Joi validation schema for validating user registration input.
 *
 * @example
 * // Example of validating registration data
 * const { error } = registerSchema.validate({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
 * if (error) {
 *   console.log(error.details[0].message); // Error message if validation fails
 * }
 */
export const registerSchema = Joi.object({
  name: Joi.string().required(), // Non-empty name, required field
  email: Joi.string().email().required(), // Valid email address, required field
  password: Joi.string().required(), // Non-empty password, required field
});


/**
 * Validation schema for the deposit request body.
 * Ensures the amount is a positive number.
 */
export const depositSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a valid number.',
    'number.positive': 'Deposit amount must be greater than zero.',
    'any.required': 'Amount is required to make a deposit.',
  }),
});

/**
 * Validation schema for the transfer request body.
 * Ensures amount is positive, receiver wallet ID is valid, and description is an optional string.
 */
export const transferSchema = Joi.object({
  receiverWalletId: Joi.string().uuid().required().messages({
    'string.guid': 'Receiver Wallet ID must be a valid UUID.',
    'any.required': 'Receiver Wallet ID is required.',
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a valid number.',
    'number.positive': 'Transfer amount must be greater than zero.',
    'any.required': 'Amount is required to make a transfer.',
  }),
  description: Joi.string().max(255).optional().messages({
    'string.max': 'Description cannot exceed 255 characters.',
  }),
});