const product = require("../models/product");
const fs = require('fs');

class ProductController {
  async addView(req, res) {
    res.render("product/add");
  }

  async createProduct(req, res) {
   
    try {
      const { productName, productPrice, desc } = req.body;
      const data = new product({
        productName,
        productPrice,
        desc,
      });

      if(req.file){
        data.image=req.file.path
      }
      const result = await data.save();
      if (result) {
        console.log(result);
        res.redirect("/list");
      } else {
        console.log("something went wrong ");
        res.redirect("/add");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async listView(req, res) {
    try {
      const products = await product.find({
        //model ta call korchi
        

        is_Deleted: false,
      });

      
      return res.render("product/list", {
        data: products, //object hisebe pass korchi,porducts ta chole jabe list page e
      });
    } catch (err) {
      console.log(err);
    }
  }

  async editView(req, res) {
    try {
      const id = req.params.id;
      const data = await product.findById(id);

      res.render("product/edit", {
        data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  // async updateProduct(req, res) {
  //   try {
  //     const id = req.params.id;
  //     const { productName, productPrice, desc } = req.body;
  //     await product.findByIdAndUpdate(id, {
  //       productName,
  //       productPrice,
  //       desc,
  //     });
  //     res.redirect("/list");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async updateProduct(req, res) {
  try {

    const id = req.params.id;

    const oldProduct = await product.findById(id);

    const updateData = {
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      desc: req.body.desc
    };

    if (req.file) {

      // Purono image delete
      if (
        oldProduct.image &&
        oldProduct.image !== 'image'
      ) {

        fs.unlink(oldProduct.image, (err) => {

          if (err) {
            console.log('Image Delete Error:', err);
          } else {
            console.log('Old Image Deleted');
          }

        });

      }

      // Notun image save
      updateData.image = req.file.path;
    }

    await product.findByIdAndUpdate(id, updateData);

    res.redirect('/list');

  } catch (err) {
    console.log(err);
  }
}

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      // hard delete
      // await product.findByIdAndDelete(id);

      // sofe delete
      await product.findByIdAndUpdate(id, {
        is_Deleted: true,
      });
      res.redirect("/list");
    } catch (err) {
      console.log(err);
    }
  }

  async trashView(req, res) {
  try {

    const products = await product.find({
      is_Deleted: true
    });

    res.render("product/trash", {
      data: products
    });

  } catch (err) {
    console.log(err);
  }
}

async restoreProduct(req,res){
  try{

    const id = req.params.id;

    await product.findByIdAndUpdate(id,{
      is_Deleted:false
    });

    res.redirect('/trash');

  }catch(err){
    console.log(err);
  }
}

async permanentDelete(req,res){
  try{

    const id = req.params.id;

    await product.findByIdAndDelete(id);

    res.redirect('/trash');

  }catch(err){
    console.log(err);
  }
}


}

module.exports = new ProductController();
