import ProductManager from './ProductManager.js';
import express from 'express';

const app = express();
const port = 8080;
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use("/api/products", routerProductos);
app.use("/api/carts", routerPets);

//cargar 10 productos a archivo.txt
const pm = new ProductManager()
for (let i = 1; i < 11; i++) {
  pm.addProduct(
    "producto "+i,
    "Es un producto de " + i,
    i*100,
    "imagen"+i,
    "AKTNCC"+i,
    25
  ); 
}

//get todos + limit
app.get('/products', (req, res) => {
  const products = pm.getProducts()
  const limit = req.query.limit || -1;

  if(limit==-1 && products.length>0){
    return res.status(200).json({
      status: "sucess",
      msg: "Found all productos",
      data: products,
    })
  }else if(limit!=-1 && products.length>0){
    return res.status(200).json({
      status: "sucess",
      msg: "Found "+ limit+ " products",
      data: products.slice(0, limit),
    })
  }else{
    return res.status(404).json({
      status: "Error",
      msg: "Products not found",
      data: products.slice(0, limit),
    })
  }
});

//getById
app.get('/products/:id', (req, res) => {
  const product = pm.getProductsById(req.params.id);
  if (typeof product !== 'string') {
    return res.status(200).json({
      status: "sucess",
      msg: "Product found",
      data: product,
    })
  } else {
    return res.status(404).json({//buscar estado correcto
      status: "Error",
      msg: "Product with id "+req.params.id+ " not found",
      data: {},
    })
  }
});

//Url error
app.get('/*', (req, res) => {
  return res.status(404).json({
    status: "Error",
    msg: "page not found",
    data: {},
  })
});

app.listen(port, () => {
  console.log('Servidor escuchando en el puerto '+port);
});
