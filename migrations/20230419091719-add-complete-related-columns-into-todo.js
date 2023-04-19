'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn(
        'Todos',
        'isComplete',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Todos',
        'completeAt',
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Todos', 'isComplete'),
      queryInterface.removeColumn('Todos', 'completeAt')
    ])
  }
};
