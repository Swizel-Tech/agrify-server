const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(productId) => "categories"
 * dropTable() => "product_names", deps: []
 * createTable() => "productnames", deps: [categories]
 *
 */

const info = {
  revision: 6,
  name: "productcat_rename_setup",
  created: "2024-06-21T22:10:21.522Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["categories", "productId", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["product_names", { transaction }],
  },
  {
    fn: "createTable",
    params: [
      "productnames",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        productname: {
          type: Sequelize.STRING,
          field: "productname",
          allowNull: false,
        },
        categoryId: {
          type: Sequelize.UUID,
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "categories", key: "id" },
          field: "categoryId",
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
    params: ["productnames", { transaction }],
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
  {
    fn: "addColumn",
    params: [
      "categories",
      "productId",
      {
        type: Sequelize.UUID,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "products", key: "id" },
        field: "productId",
        allowNull: true,
      },
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
