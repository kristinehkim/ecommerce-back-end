const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  //  Associated Category and Tag data included
  try {
    // making a request to the database to findAll(grab everything) for a response back
    const productData = await Product.findAll({
      include: [//fine tuning the request instead of finding all find the associated data below from Category and Tag models through ProductTag model - can be seen in product-tag-seeds.js
        Category,
        {
          model: Tag,
          through: ProductTag
        }
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get one product by passing it a number in the actual route
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag
        }
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  // 2 things needed for a put request: what data are we overriding so what is the new body and the id to know what and where we are updating
  try {
    const productData = await Product.update(
      {//what data we are overriding
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        tagIds: req.body.tagIds,
      }, 
      {//where it is being overridden
        where: {
          id: req.params.id,
        },
      }
    );

          res.status(200).json(productData);
        } catch (err) {
          console.log(err);
          res.status(400).json(err);
        }
      });

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;

