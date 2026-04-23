'use client';

import { useState } from 'react';
import { z } from 'zod';

// Name validation - Min 2 characters, no numbers
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .regex(/^[^0-9]+$/, 'Name cannot contain numbers');

// Email validation
export const emailSchema = z
  .string()
  .email('Please enter a valid email address');

// Password validation - Min 8 chars, uppercase, lowercase, number, special
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// Age validation - > 0 and < 120
export const ageSchema = z
  .number()
  .positive('Age must be greater than 0')
  .max(120, 'Age must be less than 120');

// Weight validation - > 0
export const weightSchema = z
  .number()
  .positive('Weight must be greater than 0');

// Complete user registration schema
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  age: ageSchema.optional(),
  weight: weightSchema.optional(),
});

// Complete user login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  age: ageSchema.optional(),
  weight: weightSchema.optional(),
  language: z.enum(['en', 'hi', 'mr', 'ta', 'fr']).optional(),
});

// Validation helper function
export const validateField = (schema, fieldName, value) => {
  try {
    schema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    if (error.errors) {
      const fieldError = error.errors.find(e => e.path[0] === fieldName);
      return { isValid: false, error: fieldError?.message || 'Invalid input' };
    }
    return { isValid: false, error: 'Invalid input' };
  }
};

// Real-time validation hook
export const useValidation = (schema, initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    try {
      schema.parse({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: null }));
      return true;
    } catch (error) {
      if (error.errors) {
        const fieldError = error.errors.find(e => e.path[0] === name);
        setErrors(prev => ({ ...prev, [name]: fieldError?.message || 'Invalid input' }));
        return false;
      }
      return false;
    }
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(name, values[name]);
  };

  const validateAll = () => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach(e => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  };
};

export default {
  nameSchema,
  emailSchema,
  passwordSchema,
  ageSchema,
  weightSchema,
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  validateField,
  useValidation,
};
