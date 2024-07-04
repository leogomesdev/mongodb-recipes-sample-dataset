import { faker } from '@faker-js/faker';
import { MongoClient, Collection } from 'mongodb';

import config from './config.js';

/**
 * Seeds the MongoDB database with synthetic data.
 * @returns {Promise<void>}
 */
async function seedDB() {
  const client = new MongoClient(config.mongodbUri);

  try {
    const collection = await getMongoCollection(client);

    if (config.mongodbResetBeforeInserting) {
      await deleteExistingData(collection);
    }

    const recipes = createSyntheticData();
    await writeSyntheticDataIntoDB(collection, recipes);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

/**
 * Deletes all existing documents from a MongoDB collection.
 * @param {Collection} collection - MongoDB collection object.
 * @returns {Promise<void>}
 */
async function deleteExistingData(collection) {
  await collection.deleteMany({});
  console.log(
    `Previous data deleted from ${config.mongodbDatabase}.${config.mongodbCollection}`
  );
}

/**
 * Connects to MongoDB using the provided MongoDB client and returns the specified collection.
 * @param {MongoClient} client - MongoDB client instance.
 * @returns {Promise<Collection>} MongoDB collection object.
 */
async function getMongoCollection(client) {
  await client.connect();
  console.log('Connected correctly to server');

  const collection = client
    .db(config.mongodbDatabase)
    .collection(config.mongodbCollection);

  return collection;
}

/**
 * Generates synthetic recipe data based on the number of recipes to insert.
 * @returns {Array<Object>} Array of synthetic recipe objects.
 */
function createSyntheticData() {
  return Array.from({ length: config.numerOfRecipesToInsert }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const updatedAt = faker.date.past();

    return {
      name: faker.food.dish(),
      category: faker.food.adjective(),
      cuisine: faker.food.ethnicCategory().toLowerCase(),
      description: faker.food.description(),
      ingredients: Array.from(
        { length: faker.number.int({ min: 3, max: 10 }) },
        () => faker.food.ingredient()
      ),
      instructions: faker.lorem.paragraphs(2),
      sender: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        first_name: firstName,
        last_name: lastName,
      },
      created_at: faker.date.past({ refDate: updatedAt }),
      updated_at: updatedAt,
    };
  });
}

/**
 * Writes synthetic recipe data into the MongoDB collection.
 * @param {Collection} collection - MongoDB collection object.
 * @param {Array<Object>} recipes - Array of synthetic recipe objects to insert.
 * @returns {Promise<void>}
 */
async function writeSyntheticDataIntoDB(collection, recipes) {
  const bulkOps = recipes.map((recipe) => ({
    insertOne: {
      document: recipe,
    },
  }));

  const result = await collection.bulkWrite(bulkOps);

  console.log(
    `${result.insertedCount} recipes inserted into ${config.mongodbDatabase}.${config.mongodbCollection}`
  );
}

// Call the seedDB function to populate MongoDB with synthetic data
seedDB();
