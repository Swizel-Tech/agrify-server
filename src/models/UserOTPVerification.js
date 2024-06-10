const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define("marchant_otp_verifications", {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    marchantId: {
      type: DataTypes.STRING,
      required: true,
    },
    otp: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
    },
  });

  return schema;
};
