const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: { model: Product }
    });

    const categories = categoryData.map( (category) => category.get({ plain: true }));

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findOne({ 
      where: { 
        id: req.params.id 
      }, 
      include: { 
        model: Product 
      } 
    });
    if(!categoryData) { res.status(400).json('A Category with that ID was not found'); return }
    const category = categoryData.get({plain: true})
    

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name
    });

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const original = await Category.findOne({ 
      where: { 
        id: req.params.id 
      }
    });
    
    if (!original) {
      res.status(200).json('A Category with that ID was not found...');
      return;
    }
    const edit = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(edit)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try { 
    await Category.findOne({ where: { id: req.params.id }}).then(async item => {
      if (!item) {
        res.status(400).json('Couldn\'t find a Category with that ID!');
        return; 
      }
      await Category.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json('Category has been deleted from the Database...')
      return;
    });
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
