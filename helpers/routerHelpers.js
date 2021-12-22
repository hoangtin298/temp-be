const Joi = require("@hapi/joi");

const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.body = validatorResult.value;
      next();
    }
  };
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const validatorResult = schema.validate({ param: req.params[name] });

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.params[name] = req.params[name];
      next();
    }
  };
};
const schemas = {
  idSchema: Joi.object().keys({
    param: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  userSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  onlineTeachingSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    linkCV: Joi.string().required(),
  }),
  userOptionalSchema: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }),
  loginRequire: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  courseInitSchema: Joi.object().keys({
    courseName: Joi.string().min(5).required(),
    description: Joi.string().min(10).required(),
    // price: Joi.number().required(),
    category: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  sectionSchema: Joi.object().keys({
    sectionTitle: Joi.string().min(5).required(),
    fromCourse: Joi.string().min(5).required(),
  }),
  sessionSchema: Joi.object().keys({
    sessionName: Joi.string().min(5).required(),
    sectionId: Joi.string().min(5).required(),
  }),
  assignmentSchema: Joi.object().keys({
    filename: Joi.string().min(5).required(),
    sectionId: Joi.string().min(5).required(),
  }),
  articleSchema: Joi.object().keys({
    articleName: Joi.string().min(5).required(),
    articleContent: Joi.string().min(5).required(),
    sectionId: Joi.string().min(5).required(),
  }),
  cartSchema: Joi.object().keys({
    userID: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    courseID: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  categorySchema: Joi.object().keys({
    category: Joi.string().min(1).required(),
  }),
};

module.exports = {
  validateBody,
  validateParam,
  schemas,
};
