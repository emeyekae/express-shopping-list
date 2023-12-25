const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get("/", function(req, res,next) {
  return res.json({ items });
});

// POST a new item
router.post("/", function(req, res, next) {
  //const newItem = { name: req.body.name, price: req.body.price };
  let newItem = {name: req.body.name, price: req.body.price};
  items.push(newItem);
  return res.json({item: newItem})
  res.status(201).json({ item: newItem });
});

// GET an item by name
router.get("/:name", function(req, res, next) {
  const foundItem = items.find(item => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  return res.json({ item: foundItem });
});

// PATCH an item by name
router.patch("/:name", function(req, res, next) {
  const foundItem = items.find(item => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price; // Assuming price should be updated here
  return res.json({ item: foundItem });
});

router.delete("/:name", function (req, res, next) {
    const foundItem = items.findIndex(item => item.name === req.params.name )
    if (foundItem === -1) {
      throw new ExpressError("Item not found", 404)
    }
    items.splice(foundItem, 1)
    return res.json({ message: "Deleted" })
  })
  
// Export the router object
module.exports = router;