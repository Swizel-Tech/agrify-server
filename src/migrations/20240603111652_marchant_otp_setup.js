const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "marchant_otp_verifications", deps: []
 *
 */

const info = {
  revision: 2,
  name: "marchant_otp_setup",
  created: "2024-06-03T11:16:52.402Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "marchant_otp_verifications",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        marchantId: {
          type: Sequelize.STRING,
          field: "marchantId",
          required: true,
        },
        otp: { type: Sequelize.STRING, field: "otp" },
        created: { type: Sequelize.DATE, field: "created" },
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
    params: ["marchant_otp_verifications", { transaction }],
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
