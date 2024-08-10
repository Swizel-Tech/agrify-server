const { ProductCategory, ProductName } = require("../../models/index.js");
const AsyncHandler = require("../../utils/asyncHandler");
const ErrorHandler = require("../../utils/customError");
const { StatusCodes } = require("http-status-codes");

// Category
const new_category = AsyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(
        new ErrorHandler(`Required fields Missing`, StatusCodes.BAD_REQUEST)
      );
    }
    const new_cat = await ProductCategory.create({
      name,
    });

    res
      .status(201)
      .json({ message: "New Category created successfully", new_cat });
  } catch (error) {
    return next(
      new ErrorHandler(
        "New Product Category creation failed.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// product name
const new_name = AsyncHandler(async (req, res, next) => {
  try {
    const { category, productname } = req.body;
    if (!productname) {
      return next(
        new ErrorHandler(`Required fields Missing`, StatusCodes.BAD_REQUEST)
      );
    }
    const cat = await ProductCategory.findOne({
      where: {
        name: category,
      },
    });
    const new_name = await ProductName.create({
      productname,
      categoryId: cat.id,
    });
    res
      .status(201)
      .json({ message: "New Name created successfully", new_name });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "New Product Category creation failed.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = {
  new_name,
  new_category,
};
