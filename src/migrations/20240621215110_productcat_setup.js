const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "categories", deps: [products]
 * createTable() => "product_names", deps: [products, categories]
 *
 */

const info = {
  revision: 5,
  name: "productcat_setup",
  created: "2024-06-21T21:51:10.953Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "categories",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
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
  {
    fn: "createTable",
    params: [
      "product_names",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        productname: {
          type: Sequelize.STRING,
          field: "productname",
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
        productNameId: {
          type: Sequelize.UUID,
          field: "productNameId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "categories", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["categories", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["product_names", { transaction }],
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
