module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "api_logs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      // Other model options go here
    }
  );
};
