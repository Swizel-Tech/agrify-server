const {
  Product,
  ProductImage,
  ProductPrice,
  Marchant,
} = require("../../models/index.js");
const AsyncHandler = require("../../utils/asyncHandler");
const ErrorHandler = require("../../utils/customError");
const { StatusCodes } = require("http-status-codes");

// Create New Product
const new_product = AsyncHandler(async (req, res, next) => {
  try {
    const { category, currentQuantity, images, pricing, productName } =
      req.body;

    if ((!category, !currentQuantity, !images, !pricing, !productName)) {
      return next(
        new ErrorHandler(`Required fields Missing`, StatusCodes.BAD_REQUEST)
      );
    }

    // Step 1: Create the product
    const newProduct = await Product.create({
      marchantId: "4b47ab2b-cb4e-48f2-9013-a6228a6ff199",
      category,
      currentQuantity,
      productName,
    });

    // Step 2: Create associated images for the product
    if (images && images.length > 0) {
      const imagePromises = images.map(async (image) => {
        await ProductImage.create({
          imageUrl: Buffer.from(image),
          productId: newProduct.id,
        });
      });
      await Promise.all(imagePromises);
    }

    // Step 3: Create associated pricing for the product
    if (pricing && pricing.length > 0) {
      const pricingPromises = pricing.map(async (price) => {
        await ProductPrice.create({
          quantity: price.quantity,
          price: price.price,
          productId: newProduct.id,
        });
      });
      await Promise.all(pricingPromises);
    }

    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    return next(
      new ErrorHandler(
        "New Product creation failed.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// Get Product
const get_product = AsyncHandler(async (req, res, next) => {
  try {
    const user = "4b47ab2b-cb4e-48f2-9013-a6228a6ff199";
    const allproduct = await Product.findAndCountAll({
      where: {
        marchantId: user,
      },
      include: [
        { model: ProductImage, as: "images" },
        { model: ProductPrice, as: "pricings" },
        { model: Marchant, as: "owner" },
      ],
    });
    res.status(StatusCodes.OK).json({ success: true, data: { allproduct } });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  new_product,
  get_product,
};
