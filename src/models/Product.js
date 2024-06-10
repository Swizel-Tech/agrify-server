const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currentQuantity: {
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

    schema.hasMany(models.ProductPrice, {
      foreignKey: "productId",
      as: "pricings",
    });

    schema.hasMany(models.ProductImage, {
      foreignKey: "productId",
      as: "images",
    });
  };

  return schema;
};
