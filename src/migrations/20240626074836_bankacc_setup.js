const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "bank_accounts", deps: [marchants]
 *
 */

const info = {
  revision: 11,
  name: "bankacc_setup",
  created: "2024-06-26T07:48:36.082Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "bank_accounts",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        acc_number: {
          type: Sequelize.STRING,
          field: "acc_number",
          allowNull: false,
        },
        acc_name: {
          type: Sequelize.STRING,
          field: "acc_name",
          allowNull: false,
        },
        bank: { type: Sequelize.STRING, field: "bank", allowNull: false },
        marchantId: {
          type: Sequelize.UUID,
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "marchants", key: "id" },
          field: "marchantId",
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
    params: ["bank_accounts", { transaction }],
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
