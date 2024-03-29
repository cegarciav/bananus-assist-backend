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
    const assistantData = [];

    const assistantIdData = ['37c57ecd-0a87-4e99-a34b-46bad09a70ab',
      '44a60dea-0f27-4ce0-8b4f-cddb5ff6adb5',
      '5384784e-4f94-4b98-856a-bd229fd5fd11', '5631f7ea-54ae-4473-8565-6ecdbb7f86d3',
      '8bb1ef91-31b8-4c73-ad67-dcc3252f8a8c', '8f755c1c-9337-49b4-ae39-fbaadf0e4086',
      'ad7e645f-d941-401e-9dc4-2851f1ed567a', 'ca607c29-5adb-4286-9f73-2eae81a75875',
      'ccc4a4fa-613a-47e8-b672-70c9941e99d7', 'e757e108-bd76-4790-8065-7fc9c529c372',
      'f05ac090-be24-46c3-95d8-0a8132e57a3d', 'f94a3416-e70e-4790-be85-8a057eeb310b'];

    const storeIdData = ['3d48dd86-a5c5-4d26-9057-8899840efae5', '5c71ad3d-9ee2-4117-ab61-6d861737c57e', '6ade4177-f386-49c1-bdc9-48650456bade',
      '7bb95b65-a553-434f-ac1c-606272614e6c', '8d215ce3-2379-4318-a2ae-bf079488242c', 'b46bad09-a70a-4b67-b1f8-110a9fcc89e1',
      'b4d62ccc-4a4f-4a61-ba7e-8b67270c9941', 'b98c56ab-d229-4fd5-bd11-603e7e83104d', 'bb463b8b-b76c-4f6a-9726-65ab5730b69b',
      'ddb56034-668b-48f0-9ac0-90be246c355d'];

    for (let i = 0; i < 12; i += 1) {
      assistantData.push({
        userId: assistantIdData[i],
        storeId: storeIdData[Math.floor(Math.random() * storeIdData.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('assistants', assistantData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('assistants', null, {});
  },
};
