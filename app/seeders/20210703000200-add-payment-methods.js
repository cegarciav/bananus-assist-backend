const faker = require('faker');

faker.locale = 'es';
faker.seed(123);

module.exports = {
  up: async (queryInterface) => {
    const paymentMethodNames = [
      'check',
      'credit card',
      'debit card',
      'cash',
      'electronic bank transfer',
    ];

    const paymentMethodsData = paymentMethodNames.map((name) => ({
      id: faker.datatype.uuid(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert('payment_methods', paymentMethodsData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('payment_methods', null, {});
  },
};
