const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(qty) => "product_orders"
 * changeColumn(currentQuantity) => "products"
 *
 */

const info = {
  revision: 8,
  name: "order_qty_setup",
  created: "2024-06-22T02:36:59.031Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "product_orders",
      "qty",
      { type: Sequelize.INTEGER, field: "qty", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "products",
      "currentQuantity",
      { type: Sequelize.INTEGER, field: "currentQuantity", allowNull: false },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "product_orders",
      "qty",
      { type: Sequelize.STRING, field: "qty", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "products",
      "currentQuantity",
      { type: Sequelize.STRING, field: "currentQuantity", allowNull: false },
      { transaction },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
