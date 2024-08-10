const {
  Product,
  ProductImage,
  ProductPrice,
  Marchant,
  ProductCategory,
  ProductName,
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
      marchantId: "087a8b59-6f41-4d27-8ce3-f6c603294829",
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
    console.log(error);
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
    const user = "087a8b59-6f41-4d27-8ce3-f6c603294829";
    const allproduct = await Product.findAndCountAll({
      where: {
        marchantId: user,
      },
      include: [
        { model: ProductImage, as: "images" },
        { model: ProductPrice, as: "pricings" },
        { model: Marchant, as: "owner" },
      ],
      distinct: true,
      // col: "Product.id",
    });
    res.status(StatusCodes.OK).json({ success: true, data: { allproduct } });
  } catch (error) {
    console.log(error);
  }
});

// get all category
const get_categories = AsyncHandler(async (req, res, next) => {
  try {
    const allcat = await ProductCategory.findAndCountAll();
    res.status(StatusCodes.OK).json({ success: true, data: { allcat } });
  } catch (error) {
    console.log(error);
  }
});

// get all product name
const get_allproductname = AsyncHandler(async (req, res, next) => {
  try {
    const categoryName = req.params.catnae;
    // Find category in DB
    const category = await ProductCategory.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      return next(
        new ErrorHandler(`Category Does not Exist`, StatusCodes.BAD_REQUEST)
      );
    }
    const cate = await ProductName.findAndCountAll({
      where: { categoryId: category.id },
    });
    res.status(StatusCodes.OK).json({ success: true, data: { cate } });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  new_product,
  get_product,
  get_categories,
  get_allproductname,
};
