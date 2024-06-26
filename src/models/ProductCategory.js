const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define(
    "categories",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  schema.associate = function (models) {
    schema.hasMany(models.ProductName, {
      foreignKey: "categoryId",
      as: "category",
    });
  };

  return schema;
};
