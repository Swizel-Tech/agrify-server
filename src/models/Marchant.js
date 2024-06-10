const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {
  const schema = sequelize.define(
    "marchants",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Email Address is required" },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Phone Number is required" },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First Name is required" },
        },
        min: [10, "First Name Must not be less than 10 characters"],
        max: [100, "First Name Must not exceed 100 characters"],
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Last Name is required" },
        },
        min: [10, "Last Name Must not be less than 10 characters"],
        max: [100, "Last Name Must not exceed 100 characters"],
      },
      pin_password: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      loginStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deviceId: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    { timestamps: true }
  );

  // HASH THE PASSWORD
  schema.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.pin_password, 10);
    user.pin_password = hashedPassword;
  });

  // COMPARE PASSWORD DURING LOG IN
  schema.prototype.comparePassword = async function (candidatePassword) {
    const isMatch = bcrypt.compare(candidatePassword, this.pin_password);
    return isMatch;
  };

  // CREATE A TOKEN
  schema.prototype.createJWT = function () {
    return jwt.sign(
      {
        email: this.email,
        fullname: this.fullname,
        isVerified: this.isVerified,
        loginStatus: this.loginStatus,
        isAdmin: this.isAdmin,
      },
      process.env.JWTSECRET,
      { expiresIn: "3d" }
    );
  };

  return schema;
};
