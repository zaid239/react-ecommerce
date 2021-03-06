const Category = require("../models/category");
const Product = require("../models/product");
const subCategory = require("../models/subCategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    let check = await Category.findOne({ slug: name });
    // console.log(check)
    if (check) {
      return res.status(400).json({ err: "Category Already Exists" });
    }
    res.json(await new Category({ name, slug: slugify(name) }).save());
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

exports.list = async (req, res) => {
  let cat = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(cat);
};

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();

  const products = await Product.find({ category }).populate("category").exec();

  res.json({
    category,
    products,
  });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    let check = await Category.findOne({ slug: name });
    // console.log(check)
    if (check) {
      return res.status(400).json({ err: "Category Already Exists" });
    } else {
      const updated = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name, slug: slugify(name) },
        { new: true }
      );
      res.json(updated);
    }
  } catch (err) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    console.log("deleted", deleted);
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Category Deleted failed");
  }
};

exports.getSubCategories = async (req, res) => {
  subCategory.find({ parent: req.params._id }).exec((err, subCategories) => {
    if (err) console.log(err);
    res.json(subCategories);
  });
};
