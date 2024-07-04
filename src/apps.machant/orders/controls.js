const {
  Orders,
  ProductImage,
  ProductPrice,
  Product,
  Marchant,
} = require("../../models/index.js");
const AsyncHandler = require("../../utils/asyncHandler.js");
const ErrorHandler = require("../../utils/customError.js");
const { StatusCodes } = require("http-status-codes");

// get completed orderss
const get_previous_sales = AsyncHandler(async (req, res, next) => {
  console.log("Hello");
  try {
    const marchantId = req.params.marchantId;

    const completed_sales = await Orders.findAndCountAll({
      where: { marchantId, status: true },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            { model: ProductImage, as: "images" },
            { model: ProductPrice, as: "pricings" },
            { model: Marchant, as: "owner" },
          ],
        },
      ],
      distinct: true,
    });

    res
      .status(201)
      .json({ message: "Orders retrieved successfully", completed_sales });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Failed to retrieve Orders.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// get pending orders
const get_pending_order = AsyncHandler(async (req, res, next) => {
  try {
    const marchantId = req.params.marchantId;
    const completed_sales = await Orders.findAndCountAll({
      where: { marchantId, status: false },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            { model: ProductImage, as: "images" },
            { model: ProductPrice, as: "pricings" },
            { model: Marchant, as: "owner" },
          ],
        },
      ],
      distinct: true,
    });

    res
      .status(201)
      .json({ message: "Orders retrived successfully", completed_sales });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Failed to retrive Orders.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// get all orders
const get_all_order = AsyncHandler(async (req, res, next) => {
  try {
    const marchantId = req.params.marchantId;

    const completed_sales = await Orders.findAndCountAll({
      where: { marchantId },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            { model: ProductImage, as: "images" },
            { model: ProductPrice, as: "pricings" },
            { model: Marchant, as: "owner" },
          ],
        },
      ],
      distinct: true,
    });

    res
      .status(201)
      .json({ message: "Orders retrieved successfully", completed_sales });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Failed to retrieve Orders.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// get an order
const get_order = AsyncHandler(async (req, res, next) => {
  try {
    const id = req.params.orderId;

    const completed_sales = await Orders.findOne({
      where: { id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            { model: ProductImage, as: "images" },
            { model: ProductPrice, as: "pricings" },
            { model: Marchant, as: "owner" },
          ],
        },
      ],
      distinct: true,
    });

    res
      .status(201)
      .json({ message: "Order retrieved successfully", completed_sales });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Failed to retrieve Order.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = {
  get_previous_sales,
  get_pending_order,
  get_all_order,
  get_order,
};
