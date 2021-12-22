const Categories = require("../model/category");
const Courses = require("../model/course");
const createCate = async (req, res, next) => {
  const newCate = new Categories(req.body);
  await newCate.save();
  res.status(201).json(newCate);
};
const createSubCate = async (req, res, next) => {
  let { cateId } = req.value.params;
  // let subCategory = req.body;
  let category = await Categories.findById(cateId);
  category.subCategoryList.push(req.body);
  await category.save();
  res.status(201).json({ message: "Sub-category added" });
};
const deleteCate = async (req, res, next) => {
  let { cateId } = req.value.params;
  let category = await Categories.findById(cateId);
  if (category.subCategoryList.length > 0) {
    // res.status(201).json({ message: "Can not delete this category" });
    throw new Error("Can not delete this category");
  } else {
    await category.remove();
    res.status(201).json({ message: "Category deleted" });
  }
};

const deleteSubCate = async (req, res, next) => {
  let { cateId, subCateId } = req.value.params;
  let category = await Categories.findById(cateId);

  category.subCategoryList = await category.subCategoryList.filter(
    (subCategory) => subCategory._id.toString() !== subCateId
  );
  await category.save();
  res.status(201).json({ message: "Sub-category deleted" });
};

const getAllCate = async (req, res, next) => {
  const categories = await Categories.find();
  res.status(201).json(categories);
};

const getAllSubCate = async (req, res, next) => {
  const categories = await Categories.find({}).select("subCategoryList");
  res.status(201).json(categories);
};
const getSubCategory = async (req, res, next) => {
  let { cateId } = req.value.params;
  let subCategoryList = await Categories.findById(cateId);
  res.status(201).json(subCategoryList);
};

const modifyCategory = async (req, res, next) => {
  let { cateId } = req.value.params;
  let cate = await Categories.findById(cateId);
  let { category } = req.body;
  cate.category = category;
  await cate.save();
  res.status(201).json({ message: "Category updated" });
};
const modifySubCategory = async (req, res, next) => {
  let { cateId, subCateId } = req.value.params;
  let { subCategory } = req.body;
  let category = await Categories.findById(cateId);
  let subCate = category.subCategoryList.find(
    (subCategory) => subCategory._id.toString() === subCateId
  );
  subCate.subCategory = subCategory;
  await category.save();
  res.status(201).json({ message: "Sub-category updated" });
};

const getCoursesByCate = async (req, res, next) => {
  let { anyCateId } = req.value.params;
  let courseList = await Courses.find(
    {
      $or: [
        { "category.mainCategory": anyCateId },
        { "category.subCategory": anyCateId },
      ],
    },
    "-courseSections -paymentAcc"
  )
    .where("approvalStatus")
    .equals("PUBLIC")
    .populate("courseCreators", "firstName lastName")
    .populate("promotion", "promotionArr");
  res.status(201).json(courseList);
};

module.exports = {
  createCate,
  createSubCate,
  deleteCate,
  deleteSubCate,
  getAllCate,
  getAllSubCate,
  getSubCategory,
  getCoursesByCate,
  modifyCategory,
  modifySubCategory,
};
