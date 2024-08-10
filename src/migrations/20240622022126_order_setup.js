const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "product_orders", deps: [products]
 *
 */

const info = {
  revision: 7,
  name: "order_setup",
  created: "2024-06-22T02:21:26.636Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "product_orders",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        qty: { type: Sequelize.STRING, field: "qty", allowNull: false },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          field: "amount",
          allowNull: false,
        },
        productId: {
          type: Sequelize.UUID,
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "products", key: "id" },
          field: "productId",
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["product_orders", { transaction }],
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
