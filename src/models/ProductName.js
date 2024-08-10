const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define(
    "productname",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      productname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  schema.associate = function (models) {
    schema.belongsTo(models.ProductCategory, {
      foreignKey: "categoryId",
      as: "category",
      allowNull: true,
    });
  };

  return schema;
};
