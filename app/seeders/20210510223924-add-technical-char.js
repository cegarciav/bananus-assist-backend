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
    const technicalCharData = [];

    const productIdData = ['b405ea1c-b2f5-48a3-a9a9-3af2deb9708a', '529c372e-55d4-4874-af2d-a5cfdf16aa96', '4b426920-f017-4ad7-a645-fd94101e9dc4',
      'acd5d2fa-b3cc-4b79-9b0b-0008bcb3a7e6', '7f43c928-90f8-4e03-a0cf-5e4e669b9326', '1ed567a9-f031-40a0-abee-677698dd7a33',
      'bb463b8b-b76c-4f6a-9726-65ab5730b69b', '72fd0e22-4cff-4ef2-8f6c-183e1ee68a8a', '8a7baa87-070c-4b0b-9f8e-772af7c356c1',
      '558b9a3f-94a3-4416-a70e-790fe858a057', '4df2e67c-1836-4477-951c-77bd9f13b98d', '219f34b6-5a49-4fe0-ba80-5c93511a0bea ',
      '8b86a4d7-bb95-4b65-a553-34fac1c60627', 'cc3252f8-a8c6-4b53-876c-0a0011a56f27', '54ae4734-5656-4ecd-bb7f-86d3b184b251',
      'aebf0794-8824-42cb-958b-e8365eddb560', 'ed7f6c4c-ee8d-4c6d-8ef4-d5c9a7ce46b7', '941e99d7-52e0-4c29-9c71-ad3d9ee21172',
      'e60545fd-88a8-4017-8f66-11278f755c1c', '9a3ba838-41b9-48a5-98bb-1ef9131b8c73', 'af9b8dc7-1103-4fc7-8595-5c862cb73d41',
      '7b1f8110-a9fc-4c89-a14b-7af05c38465c', '318b8ebf-5fc7-4ae0-b8bd-299248dc614d', '6cebf887-9914-4576-ade4-177f3869c17d',
      'b8f05ac0-90be-4246-8355-d80a8132e57a', '4b98c56a-bd22-49fd-9fd1-1603e7e83104', '316b35df-7243-4e75-be10-8bd76790c065',
      'b46e39fb-aadf-40e4-8861-9f239553f193', 'fc1d315a-274e-4cc8-90ef-d9d0ea6642b9', '861737c5-7ecd-40a8-be99-634b46bad09a',
      '71c7b806-b4d6-42cc-84a4-fa613a7e8b67', '295adb28-61f7-432e-ae81-a75875d02311', '465c0f52-8728-4964-8a60-dea0f27ce0cb',
      'b5ff6adb-57e1-42ff-ad1d-21d9408b1091', '724858fb-74a6-458f-9a53-213f5f19e073', '6c33ae0e-c585-4e28-9042-cc4787d5d4ef',
      '50456bad-e487-4a49-994a-8d215ce32379', '0b6e58df-07e0-4a8e-899c-d555e66c6563', '765e4f19-1afd-4ce2-a34a-bcac72dfe3b9',
      'd86a5c5d-26d0-4578-8998-40efae538478 '];

    for (let i = 0; i < 80; i += 1) {
      technicalCharData.push({
        id: faker.datatype.uuid(),
        key: faker.commerce.productAdjective(),
        value: faker.commerce.productDescription(),
        productId: productIdData[Math.floor(Math.random() * productIdData.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('technical_chars', technicalCharData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('technical_chars', null, {});
  },
};
