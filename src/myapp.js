// require the necessary libraries
const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;

const config = require("./config");

async function seedDB() {
  // Connection URL
  const client = new MongoClient(config.mongodbUri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db(config.mongodbDatabase);
    const collection = database.collection(config.mongodbCollection);

    if (config.mongodbResetBeforeInserting) {
      await collection.deleteMany({});
    }

    // Generate synthetic cooking recipes
    const recipes = Array.from({ length: config.recipesToInsert }, () => {
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

    // Prepare bulk write operations
    const bulkOps = recipes.map((recipe) => ({
      insertOne: {
        document: recipe,
      },
    }));

    const result = await collection.bulkWrite(bulkOps);

    console.log(`${result.insertedCount} recipes inserted`);
    console.log("Database seeded with synthetic data! :)");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

seedDB();
