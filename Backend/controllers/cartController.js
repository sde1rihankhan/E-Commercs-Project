import { Cart } from "../models/cartModel.js";
import Product from "../models/productModels.js";

export const getCart = async (req, resp) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("item.productId");
    if (!cart) {
      return resp.json({ cart: [] });
    }
    resp.status(200).json({ cart });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const addToCart = async (req, resp) => {
  try {
    // const userId = req.id;
    const userId = req.user._id; // req.user se logged in user id lo
    const { productId } = req.body;

    if (!productId) {
      return resp.status(400).json({
        message: "productId is required", // missing productId handle karo
      });
    }

    //check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({
        message: "product not found",
      });
    }

    // find the user's cart (if exists) agar user ka cart hai to us ko find karna
    let cart = await Cart.findOne({ userId });

    //if cart dosen't exists, create a new cart agar user ka cart nahi hai to new cart create karna
    if (!cart) {
      cart = new Cart({
        userId,
        // item: [{ productId, quantity: 1, price: product.productPrice }],
        // totalPrice: product.productPrice,

        items: [
          {
            productId: product._id, // product reference save karo
            quantity: 1, // initial quantity
            price: product.productPrice || product.price, // schema required field
          },
        ],
        totalPrice: product.productPrice || product.price, // initial total
      });
      await cart.save();
    } else {
      //Find if product is already in the cart

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        return resp.status(409).json({
          message: "Product is already in your cart!",
        });
      } else {
        cart.items.push({
          productId: product._id,
          quantity: 1,
          price: product.productPrice || product.price,
        });
      }

      // if (itemIndex > -1) {
      //   //if product exists -> just increase quantity
      //   cart.items[itemIndex].quantity += 1;
      // } else {
      //   // if new product -> push to cart
      //   // cart.items.push({
      //   //   productId,
      //   //   quantity: 1,
      //   //   price: product.productPrice,
      //   // });
      //   cart.items.push({
      //     productId: product._id, // new product add karo
      //     quantity: 1,
      //     price: product.productPrice || product.price, // required price save karo
      //   });
      // }

      //Recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    // Save updated cart
    await cart.save();

    //Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return resp.status(200).json({
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, resp) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return resp.status(404).json({
        message: "Cart not found",
      });
    }
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    ); //check ki zis product ko addToCart kiya hai wo product cart main hai ya nhin

    if (!item) {
      return resp.status(404).json({
        message: "Item not found",
      });
    }

    if (type === "increase") item.quantity += 1;
    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    cart = await cart.populate("items.productId");

    resp.status(200).json({
      cart,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, resp) => {
  try {
    // user id le raha hai
    const userId = req.id;

    // request body se product id le raha hai
    const { productId } = req.body;

    // cart fetch kar raha hai
    const cart = await Cart.findOne({ userId });

    // cart missing ho to return kar raha hai
    if (!cart) {
      return resp.status(404).json({
        message: "Cart not found",
      });
    }

    // selected item remove kar raha hai
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    // total price recalculate kar raha hai
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // updated cart save kar raha hai
    await cart.save();

    // populated cart return kar raha hai
    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    // cart = await cart.populate("items.productId");

    return resp.status(200).json({
      message: "Product remove from cart",
      cart: updatedCart,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};
