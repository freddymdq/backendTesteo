import cartModel from "../models/cart.model.js";
import productModel from "../models/products.model.js";

export default class CartManagerMongo {
  // DETALLE CARRITO
  async getCartDetails(cartId) {
    const cart = await cartModel
      .findById(cartId)
      .populate('products.product');
    return cart;
  }

  // AGREGAR PRODUCTO AL CARRITO
  async addProductInCart(cartId, productId, quantity) {
    const product = await productModel.findById(productId);
    if (!product) {
      return null;
    }
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return null;
    }
    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1; // Incrementa la cantidad existente en 1
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 }); // Agrega un nuevo producto con la cantidad especificada o 1 como valor predeterminado
    }
    await cart.save();
    return cart;
  }
  
  // VACIAR CARRITO
  async emptyCart(cartId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return null;
    }
    cart.products = [];
    await cart.save();
    return cart;
  }
  // ACTUALIZAR CANTIDAD PRODUCTOS EN CARRITO
  async updateProductQuantityInCart(cartId, productId, quantity) {
    const product = await productModel.findById(productId);
    if (!product) {
      return null;
    }
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return null;
    }
    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (!existingProduct) {
      return null;
    }
    if (quantity === 0) {
      cart.products = cart.products.filter(p => p.product.toString() !== productId);
    } else {
      existingProduct.quantity = quantity;
    }
    await cart.save();
    return cart;
  }
}

