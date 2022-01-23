const { response } = require('express');
var express = require('express');
const app = require('../app');
var router = express.Router();
const path=require('path')
const fs=require('fs')

const userController=require('../controllers/userController');
const productController=require('../controllers/productController');
const { addAdmin, warehouse } = require('../controllers/productController');

//Home page
//===========================================================

router.get('/',(req,res)=>{
  res.render('admin/home',{admin:true})
})

  /* get warehouse-----
==================================================*/ 

  router.get('/addwarehouse', function(req,res) {
    let message=req.flash('message')
    let errMessage=req.flash('errMessage')
    res.render('admin/addwarehouse', { admin:true,message,errMessage});
  });

  /*insert warehouse
==================================================*/ 

  router.post('/addwarehouse',(req,res)=>{
    productController.warehouse(req.body).then((response)=>{
      if(!response.status)
      {
        req.flash("message","warehouse added successfully")
        res.redirect('addwarehouse')
      }
      else
      {
        req.flash("errMessage","warehouse already exist")
        res.redirect('addwarehouse')
      }
  })
})

/*list warehouses
==================================================*/ 

router.get('/viewwarehouse', function(req, res) {
  productController.viewWarehouse().then((warehouse)=>{
    if(warehouse)
    res.render('admin/viewwarehouse',{admin:true,warehouse})
  })
});


  /*edit warehouses
==================================================*/ 

router.get('/editWarehouses/:id',(req,res)=>{
  productController.getwarehousesByid(req.params.id).then((warehouses)=>{
      res.render('admin/updateWarehouses',{admin:true,warehouses})
  })
})

/*update warehouses
==================================================*/ 

router.post('/upadateWarehouses/:id',(req,res)=>{
  var id=req.params.id;
  productController.upadateWarehouses(req.body,id).then((response)=>{
    if(response.updateStatus){
      res.redirect('/admin/viewwarehouse')
    }
  })
})


/* get product-----
==================================================*/ 

router.get('/product',(req,res)=> {
  let message=req.flash('message')
  let errMessage=req.flash('errMessage')
  res.render('admin/addproduct', { admin:true,message,errMessage});
});

/*insert product
==================================================*/ 

router.post('/addProduct',(req,res)=>{
  productController.addProduct(req.body).then((response)=>{
      if(!response.status)
      {
        req.flash("message","product added successfully")
        res.redirect('product')
      }
      else
      {
        req.flash("errMessage","product already exist")
        res.redirect('product')
      }
  })
})

/*list product details
==================================================*/ 

  router.get('/listproduct', function(req, res) {
    productController.viewProduct().then((products)=>{
      if(products)
        res.render('admin/listproduct',{admin:true,products})
    })
  });

  /*edit product
==================================================*/ 

  router.get('/editProduct/:id',(req,res)=>{
    productController.getproductByid(req.params.id).then((products)=>{
        res.render('admin/upadateProduct',{admin:true,products})
    })
  })

 /*update product
==================================================*/ 

  router.post('/upadateProduct/:id',(req,res)=>{
    var id=req.params.id;
    productController.updateproduct(req.body,id).then((response)=>{
      if(response.updateStatus){
        res.redirect('/admin/listproduct')
      }
    })
  })


  /* get stock-----
==================================================*/ 

  router.get('/addstock', (req,res) =>{
    productController.viewProduct().then((products)=>{
      productController.viewWarehouse().then((warehouse)=>{
        let message=req.flash('message')
        res.render('admin/addstock', { admin:true,message,products,warehouse});
      })
    })
  });

  /* insert stock-----
==================================================*/ 

  router.post('/addstock',(req,res)=>{
    productController.addStock(req.body).then((response)=>{
      req.flash("message","Stock added successfully")
      res.redirect('addstock')
    })
  })
 
/*list stock details
==================================================*/ 

  router.get('/viewstock',(req,res)=>{
    let message=req.flash('message')
    productController.getstock().then(async(stockProducts)=>{
      if(stockProducts)
        res.render("admin/viewstock",{stockProducts,admin:true,message})
    });
  })

/*unstock quantity
==================================================*/ 
  
  router.get("/Unstockquantity/:stockId",(req,res)=>{
    let stockId=req.params.stockId;
    productController.unstockqty(stockId).then(()=>{
      req.flash("message","Unstock successfully")
      res.redirect('/admin/viewstock')
    })
  })

  /*edit stock details
==================================================*/

router.get('/editStock/:id',(req,res)=>{
  productController.viewProduct().then((products)=>{
    productController.viewWarehouse().then((warehouse)=>{
  productController.getstockByid(req.params.id).then((stock)=>{
      res.render('admin/updateStock',{admin:true,stock,products,warehouse})
  })
})
})
})

 /*update stock details
==================================================*/

router.post('/updateStock/:id',(req,res)=>{
  var id=req.params.id;
  productController.updateStock(req.body,id).then((response)=>{
    if(response.updateStatus){
      res.redirect('/admin/viewstock')
    }
  })
})
module.exports = router;
