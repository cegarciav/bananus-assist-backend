const faker = require('faker');

faker.locale = 'es';
faker.seed(123);

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const productsData = [];

    const storeIdData = ['3d48dd86-a5c5-4d26-9057-8899840efae5', '5c71ad3d-9ee2-4117-ab61-6d861737c57e', '6ade4177-f386-49c1-bdc9-48650456bade',
      '7bb95b65-a553-434f-ac1c-606272614e6c', '8d215ce3-2379-4318-a2ae-bf079488242c', 'b46bad09-a70a-4b67-b1f8-110a9fcc89e1',
      'b4d62ccc-4a4f-4a61-ba7e-8b67270c9941', 'b98c56ab-d229-4fd5-bd11-603e7e83104d', 'bb463b8b-b76c-4f6a-9726-65ab5730b69b',
      'ddb56034-668b-48f0-9ac0-90be246c355d'];

    for (let i = 0; i < 40; i += 1) {
      productsData.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        sku: faker.datatype.number(),
        price: faker.commerce.price(),
        image: faker.image.fashion(),
        storeId: storeIdData[Math.floor(Math.random() * storeIdData.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('products', productsData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('products', null, {});
  },
};
