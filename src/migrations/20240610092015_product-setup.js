const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "products", deps: []
 * createTable() => "productImages", deps: [products]
 * createTable() => "pricings", deps: [products]
 *
 */

const info = {
  revision: 3,
  name: "product-setup",
  created: "2024-06-10T09:20:15.342Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "products",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        category: {
          type: Sequelize.STRING,
          field: "category",
          allowNull: false,
        },
        productName: {
          type: Sequelize.STRING,
          field: "productName",
          allowNull: false,
        },
        currentQuantity: {
          type: Sequelize.STRING,
          field: "currentQuantity",
          allowNull: false,
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
      "productImages",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        imageUrl: {
          type: Sequelize.STRING,
          field: "imageUrl",
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
  {
    fn: "createTable",
    params: [
      "pricings",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        quantity: {
          type: Sequelize.STRING,
          field: "quantity",
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          field: "price",
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
    params: ["products", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["productImages", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["pricings", { transaction }],
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
