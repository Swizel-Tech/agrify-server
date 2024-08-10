const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define(
    "bank_account",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      acc_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      acc_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marchantId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  schema.associate = function (models) {
    schema.belongsTo(models.Marchant, {
      foreignKey: "marchantId",
      as: "owner",
      allowNull: true,
    });
  };

  return schema;
};
