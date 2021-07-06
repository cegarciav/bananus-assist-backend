module.exports = {
  up: async (queryInterface, Sequelize) => {
    let call_data = [];
    for (let year = 2019; year < 2022; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        call_data.push({
          calls: parseInt(Math.random() * (20 - 12) + 12, 10),
          date: new Date(year.toString(), month.toString(), 5),
        });
      }
    }
      await queryInterface.bulkInsert('call_requests', call_data);
  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.bulkDelete('call_requests', null, {});
  }
};
