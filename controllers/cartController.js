const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

 
// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, price, size, color } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user });

    if (!cart) {
      cart = new Cart({ user: req.user, products: [{ product: productId, quantity, price, size, color }] });
    } else {
      // Check if the product is already in the cart
      const existingProduct = cart.products.find((item) => item.product.equals(productId));

      if (existingProduct) {
        // If the product exists, update its quantity and calculate the updated price
        existingProduct.quantity += quantity;
        existingProduct.price += quantity * price;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.products.push({ product: productId, quantity, price });
      }
    }

    await cart.save();

    res.status(201).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
  }
};


// Get the user's cart
exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user }).populate('products.product');
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ message: 'Error getting cart', error: error.message });
    }
};

// Update the quantity of a product in the cart
exports.updateCartItemQuantity = async (req, res) => {
  try {
      const { productId, quantity, size, color } = req.body; 

      const cart = await Cart.findOne({ user: req.user });

      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      let cartProduct = cart.products.find((item) => item.product.equals(productId));

      if (!cartProduct) {
          
          cartProduct = {
              product: productId,
              quantity: quantity,
              size: size, 
              color: color,  
          };
          cart.products.push(cartProduct);
      } else {
           
          cartProduct.quantity = quantity;
          if (size) cartProduct.size = size; 
          if (color) cartProduct.color = color; 
      }

      await cart.save();

      res.status(200).json({ message: 'Cart item updated successfully', cart });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update cart item', error: error.message });
  }
};

  
  // Remove a product from the cart
exports.removeFromCart = async (req, res) => {
    try {
      const productId = req.params.productId;
  
      const cart = await Cart.findOne({ user: req.user });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.products = cart.products.filter((item) => !item.product.equals(productId));
  
      await cart.save();
  
      res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
    }
};

//  clear all user's cart
exports.clearUserCart = async (req, res) => {
  try {
    await Cart.deleteOne({ user: req.user });

    res.status(200).json({ message: 'User cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear user cart', error: error.message });
  }
};
