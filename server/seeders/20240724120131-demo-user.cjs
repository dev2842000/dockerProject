const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

const createUser = async (permalink, name, email, password) => ({
  permalink,
  name,
  email,
  password: await hashPassword(password),
  enabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted: false
});

module.exports = {
  up: async (queryInterface) => {
    try {
      const users = await Promise.all([
        createUser('example-permalink1', 'Example User 1', 'example1@example.com', 'password123'),
        createUser('example-permalink2', 'Example User 2', 'example2@example.com', 'password123'),
        createUser('example-permalink3', 'Example User 3', 'example3@example.com', 'password123'),
        createUser('example-permalink4', 'Example User 4', 'example4@example.com', 'password123'),
        createUser('example-permalink5', 'Example User 5', 'example5@example.com', 'password123')
      ]);

      await queryInterface.bulkInsert('Users', users, {});
      console.log('Seeding successful');
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.bulkDelete('Users', null, {});
      console.log('Rollback successful');
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  }
};
