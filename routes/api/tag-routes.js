const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    });

    const tags = tagData.map( (tag) => tag.get({ plain: true }));

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findOne({ 
      where: { 
        id: req.params.id 
      }, 
      include: { 
        model: Product 
      } 
    });
    const tag = tagData.get({plain: true})
    

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    });

    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const original = await Tag.findOne({ 
      where: { 
        id: req.params.id 
      }
    });
    
    if (!original) {
      res.status(200).json('A Tag with that ID was not found...');
      return;
    }
    const edit = await Tag.update(req.body, {
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
  // delete on tag by its `id` value
  try { 
    await Tag.findOne({ where: { id: req.params.id }}).then(async item => {
      if (!item) {
        res.status(400).json('Couldn\'t find a Tag with that ID!');
        return; 
      }
      await Tag.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json('Tag has been deleted from the Database...')
      return;
    });
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
