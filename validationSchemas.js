const Joi = require('joi');

const valid_schema_user_register = Joi.object({
    username: Joi.string().min(3).max(24).required().messages({
        'string.base': 'Login musi być tekstem..',
        'string.empty': 'Login nie może być pusty..',
        'string.min': 'Login musi zawierać co najmniej {#limit} znaki..',
        'string.max': 'Login może mieć maksymalnie {#limit} znaków..',
        'any.required': 'Login jest wymagany..'
    }),
    email: Joi.string().max(48).email().messages({
        'string.email': 'Podaj poprawny adres e-mail..',
        'string.max': 'Email może mieć maksymalnie {#limit} znaków..',
        'string.empty': 'Pole email nie może być puste..'
    }),
    pass: Joi.string().min(6).required().messages({
        'string.min': 'Hasło musi mieć co najmniej {#limit} znaków..',
        'string.empty': 'Pole hasło nie może być puste..',
        'any.required': 'Hasło jest wymagane..',
    })
}).unknown(true);


const valid_schema_user_login = Joi.object({
    username: Joi.string().min(3).max(24).required().messages({
        'string.base': 'Login musi być tekstem..',
        'string.empty': 'Login nie może być pusty..',
        'string.min': 'Login musi zawierać co najmniej {#limit} znaki..',
        'string.max': 'Login może mieć maksymalnie {#limit} znaków..',
        'any.required': 'Login jest wymagany..'
    }),
    pass: Joi.string().min(6).required().messages({
        'string.min': 'Hasło musi mieć co najmniej {#limit} znaków..',
        'string.empty': 'Pole hasło nie może być puste..',
        'any.required': 'Hasło jest wymagane..',
    })
}).unknown(true);


module.exports = {valid_schema_user_login, valid_schema_user_register};