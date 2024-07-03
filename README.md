# MongoDB Recipes Sample Dataset

This project provides a sample dataset of recipes to be used with MongoDB. It allows you to quickly populate a MongoDB collection with a specified number of recipe documents.

## Requirements

- Node.js v20 or higher
- A MongoDB server where the data will be saved

## Setup Instructions

1. **Clone the Project:**

```bash
git clone https://github.com/leogomesdev/mongodb-recipes-sample-dataset.git
cd mongodb-recipes-sample-dataset
```

2. **Install Dependencies:**

```bash
  npm install
```

3. **Copy Environment Configuration File:**

```bash
  cp -v .env.example .env
```

4. **Edit the .env File to Update Environment Variables:**

```bash
  MONGODB_URI=your_mongodb_server_uri
  MONGODB_DATABASE=your_database_name
  MONGODB_COLLECTION=your_collection_name
  MONGODB_RESET_BEFORE_INSERTING=true_or_false
  RECIPES_TO_INSERT=number_of_documents_to_insert
```

- `MONGODB_URI`: The connection string for the MongoDB server
- `MONGODB_DATABASE`: The name of the MongoDB database
- `MONGODB_COLLECTION`: The name of the MongoDB collection
- `MONGODB_RESET_BEFORE_INSERTING`: If set to true, all records in the collection will be deleted before inserting new documents
- `RECIPES_TO_INSERT`: The number of recipe documents to insert into the collection

## Running the Project

After setting up the environment variables, you can run the project to populate your MongoDB collection with the sample dataset.

```bash
  npm start
```

## Packages Used

The project uses the following packages:

- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a .env file into process.env. This allows you to keep sensitive configuration data out of your source code
- [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker): A library for generating massive amounts of fake (but realistic) data for testing and development
- [joi](https://www.npmjs.com/package/joi): A powerful schema description language and data validator for JavaScript, useful for validating the .env variables
- [mongodb](https://www.npmjs.com/package/mongodb): The official MongoDB driver for Node.js, enabling you to interact with MongoDB from your Node.js application

### Using Faker JS

The project uses faker.js library to generate synthetic data for the recipes.

For more information, please check the [MongoDB docs on synthetic data](https://www.mongodb.com/docs/atlas/synthetic-data/) or refer to the [Faker JS v9 docs](https://v9.fakerjs.dev/api/food.html).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
