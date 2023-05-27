import { Router } from 'express';
import ProductManagerMongo from '../Dao/controllers/ProductManagerMongo.js';
import productModel from '../Dao/models/products.model.js';

const router = Router();
const productManager = new ProductManagerMongo();

// MUESTRA PRODUCTOS
router.get('/', async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).send({ products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error interno' });
  }
});

// PRODUCTO POR ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.find({ _id: productId });
    res.status(200).send({ product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error interno' });
  }
});

//AGREGA PRODUCTO
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    await productManager.addProduct(productData);
    res.status(200).send({ msg: 'Producto creado' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error interno' });
  }
});

// BORRA PRODUCTO POR ID
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await productModel.deleteOne({ _id: productId });
    res.status(200).send({ msg: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error interno' });
  }
});

//ACTUALIZA PRODUCTO POR ID
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    await productModel.updateOne({ _id: productId }, { $set: updateData });
    res.status(200).send({ msg: 'Producto actualizado'});
  } catch (error) {
    console.error(error);
    res.status(500).send({error: 'Error interno'});
  }
});

export default router;

