const express=require('express');
const homeController = require('../controller/homeController');
const productController=require('../controller/ProductController');
const ProductImage = require('../utils/fileUpload');

const router=express.Router();




router.get("/",homeController.index)
router.get("/about",homeController.about)
router.get("/contact",homeController.contact)
router.get('/index1',homeController.index1)


// card ejs

router.get('/add',productController.addView)
router.post('/create/product',ProductImage.single('image'),productController.createProduct)
router.get('/list',productController.listView)
router.get('/edit/:id',productController.editView)
router.post('/update/:id', ProductImage.single('image'),productController.updateProduct)
router.get('/delete/:id',productController.deleteProduct)
router.get('/trash', productController.trashView);
router.get('/restore/:id', productController.restoreProduct);

router.get('/permanent-delete/:id',
productController.permanentDelete);

module.exports=router;