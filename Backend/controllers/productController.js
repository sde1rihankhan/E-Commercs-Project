import Product from "../models/productModels.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, resp) => {
  try {

    console.log("req.body",req.body);
    console.log("req.files:", req.files);

    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return resp.status(400).json({
        message: "All fields are required",
      });
    }

    //Handle Multiple Image Uploade
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        console.log("file received:", file);
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", // cloudinary folder name
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    //create a product in DB
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg, // array of objects [{url, public_id},{url, public_id}]
    });

    return resp.status(200).json({
      message: "Product addedd successfully",
      product: newProduct,
      body: req.body,
      files: req.files,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const getAllProduct = async (req, resp) => {
  try {
    const products = await Product.find();

    if (!products) {
      return resp.status(404).json({
        message: "No product available",
        products: [],
      });
    }
    return resp.status(200).json({
      products,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, resp) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }

    //Delete images for cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }

    //Delete product from MongoDB
    await Product.findByIdAndDelete(productId);
    return resp.status(200).json({
      message: "Product Deleted successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, resp) => {
  try {
    const { productId } = req.params;

    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }

    let updatedImages = [];

    //Keep Selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id)
      );

      //delete only removed image
      const removedImage = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id)
      );

      for (let img of removedImage) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg; //keep all nothing sent
    }

    // upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });
        updatedImages.push({
          url: result.secure_uri,
          public_id: result.public_id,
        });
      }
    }

    //update product
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    return resp.status(200).json({
        message:"Product updated successfully",
        product
    })
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};
