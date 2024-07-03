const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;

const config = require("./config");

/**
 * Seeds the MongoDB database with synthetic data.
 * @async
 * @function seedDB
 * @returns {Promise<void>}
 */
seedDB = async () => {
  const client = new MongoClient(config.mongodbUri);

  try {
    const collection = await getMongoDBCollection(client, config);

    if (config.mongodbResetBeforeInserting) {
      await deleteExistingData(collection, config);
    }

    const recipes = createSyntheticData(config.recipesToInsert);
    await writeSyntheticDataIntoDB(collection, recipes, config);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
};

/**
 * Deletes all existing documents from a MongoDB collection.
 * @async
 * @function deleteExistingData
 * @param {MongoCollection} collection - MongoDB collection object.
 * @param {object} options - Configuration object.
 * @param {string} options.mongodbDatabase - MongoDB database name.
 * @param {string} options.mongodbCollection - MongoDB collection name.
 * @returns {Promise<void>}
 */
deleteExistingData = async (collection, { mongodbDatabase, mongodbCollection }) => {
  await collection.deleteMany({});
  console.log(`Previous data deleted from ${mongodbDatabase}.${mongodbCollection}`);
};

/**
 * Connects to MongoDB using the provided MongoDB client and returns the specified collection.
 * @async
 * @function getMongoDBCollection
 * @param {MongoClient} client - MongoDB client instance.
 * @param {object} options - Configuration object.
 * @param {string} options.mongodbDatabase - MongoDB database name.
 * @param {string} options.mongodbCollection - MongoDB collection name.
 * @returns {Promise<MongoCollection>} MongoDB collection object.
 */
getMongoDBCollection = async (client, { mongodbDatabase, mongodbCollection }) => {
  await client.connect();
  console.log("Connected correctly to server");

  const collection = client.db(mongodbDatabase).collection(mongodbCollection);

  return collection;
};

/**
 * Generates synthetic recipe data based on the number of recipes to insert.
 * @function createSyntheticData
 * @param {number} recipesToInsert - Number of synthetic recipes to generate.
 * @returns {Array<Object>} Array of synthetic recipe objects.
 */
createSyntheticData = (recipesToInsert) => {
  return Array.from({ length: recipesToInsert }, () => {
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
};

/**
 * Writes synthetic recipe data into the MongoDB collection.
 * @async
 * @function writeSyntheticDataIntoDB
 * @param {MongoCollection} collection - MongoDB collection object.
 * @param {Array<Object>} recipes - Array of synthetic recipe objects to insert.
 * @param {object} options - Configuration object.
 * @param {string} options.mongodbDatabase - MongoDB database name.
 * @param {string} options.mongodbCollection - MongoDB collection name.
 * @returns {Promise<void>}
 */
writeSyntheticDataIntoDB = async (collection, recipes, { mongodbDatabase, mongodbCollection }) => {
  const bulkOps = recipes.map((recipe) => ({
    insertOne: {
      document: recipe,
    },
  }));

  const result = await collection.bulkWrite(bulkOps);

  console.log(`${result.insertedCount} recipes inserted into ${mongodbDatabase}.${mongodbCollection}`);
};

// Call the seedDB function to populate MongoDB with synthetic data
seedDB();
