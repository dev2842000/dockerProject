const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await hashPassword('password123');
    await queryInterface.bulkInsert('Users', [{
      permalink: 'example-permalink',
      name: 'Example User',
      email: 'example@example.com',
      password: hashedPassword,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
