import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables from .env file
dotenv.config();

const envVarsSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required(),
  MONGODB_DATABASE: Joi.string().required(),
  MONGODB_COLLECTION: Joi.string().required(),
  MONGODB_RESET_BEFORE_INSERTING: Joi.boolean().required(),
  NUMBER_OF_RECIPES_TO_INSERT: Joi.number().integer().min(1).default(300),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  mongodbUri: envVars.MONGODB_URI,
  mongodbDatabase: envVars.MONGODB_DATABASE,
  mongodbCollection: envVars.MONGODB_COLLECTION,
  mongodbResetBeforeInserting: envVars.MONGODB_RESET_BEFORE_INSERTING,
  numerOfRecipesToInsert: envVars.NUMBER_OF_RECIPES_TO_INSERT,
};

export default config;
