const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "marchants", deps: []
 *
 */

const info = {
  revision: 1,
  name: "marchant_setup",
  created: "2024-06-03T10:13:26.846Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "marchants",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        phone: { type: Sequelize.STRING, field: "phone", allowNull: false },
        firstName: {
          type: Sequelize.STRING,
          field: "firstName",
          max: [100, "First Name Must not exceed 100 characters"],
          min: [10, "First Name Must not be less than 10 characters"],
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          field: "lastName",
          max: [100, "Last Name Must not exceed 100 characters"],
          min: [10, "Last Name Must not be less than 10 characters"],
          allowNull: false,
        },
        pin_password: { type: Sequelize.STRING, field: "pin_password" },
        verified: {
          type: Sequelize.BOOLEAN,
          field: "verified",
          defaultValue: false,
        },
        loginStatus: {
          type: Sequelize.BOOLEAN,
          field: "loginStatus",
          defaultValue: false,
        },
        deviceId: {
          type: Sequelize.STRING,
          field: "deviceId",
          defaultValue: "",
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
    params: ["marchants", { transaction }],
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
