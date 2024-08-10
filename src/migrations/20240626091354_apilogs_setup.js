const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "action_logs", deps: []
 * createTable() => "api_logs", deps: []
 *
 */

const info = {
  revision: 12,
  name: "apilogs_setup",
  created: "2024-06-26T09:13:54.762Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "action_logs",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          unique: true,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        userId: { type: Sequelize.STRING, field: "userId", allowNull: false },
        action: { type: Sequelize.STRING, field: "action", allowNull: true },
        data: { type: Sequelize.TEXT, field: "data", allowNull: true },
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
        deletedAt: { type: Sequelize.DATE, field: "deletedAt" },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "api_logs",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          unique: true,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        provider: {
          type: Sequelize.STRING,
          field: "provider",
          allowNull: true,
        },
        data: { type: Sequelize.JSON, field: "data", allowNull: true },
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
        deletedAt: { type: Sequelize.DATE, field: "deletedAt" },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["action_logs", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["api_logs", { transaction }],
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
