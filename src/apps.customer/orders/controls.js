const { Orders, Product } = require("../../models/index.js");
const AsyncHandler = require("../../utils/asyncHandler.js");
const ErrorHandler = require("../../utils/customError.js");
const { StatusCodes } = require("http-status-codes");

// Place Order
const order = AsyncHandler(async (req, res, next) => {
  try {
    const { productId, amount, qty } = req.body;
    if ((!productId, !amount, !qty)) {
      return next(
        new ErrorHandler(`Required fields Missing`, StatusCodes.BAD_REQUEST)
      );
    }

    if (productId === "") {
      return next(
        new ErrorHandler(`Product Id is Missing`, StatusCodes.BAD_REQUEST)
      );
    }

    // Get the product
    const product_id = await Product.findOne({
      where: { id: productId },
    });

    if (qty > product_id.currentQuantity) {
      return next(
        new ErrorHandler(
          `This Vendor only has ${product_id.currentQuantity} Baskets at the momment, you can buy from another Vendor`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const new_qty = product_id.currentQuantity - qty;

    // Step 3: Update the product with new quantity
    await product_id.update({ currentQuantity: new_qty });

    // Step 1: Create the product
    const new_order = await Orders.create({
      productId: product_id.id,
      amount,
      qty,
      status: false,
    });

    res.status(201).json({ message: "Order Placed successfully", new_order });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Failed to place an Order, please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = {
  order,
};
