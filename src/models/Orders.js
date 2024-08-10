const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define(
    "product_order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      marchantId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  schema.associate = function (models) {
    schema.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
      allowNull: true,
    });

    schema.belongsTo(models.Marchant, {
      foreignKey: "marchantId",
      as: "seller",
      allowNull: true,
    });
  };

  return schema;
};
