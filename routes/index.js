var express = require('express');
var router = express.Router();
const app = require('../app');
const path=require('path')

const productController=require('../controllers/productController')
const userController=require('../controllers/userController');
const { ConnectionPoolClosedEvent } = require('mongodb');
const { Console } = require('console');
const { response } = require('express');

//midleware
//=============================================



const verifyUserLogin=(req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }

}

//home page
//========================================================

router.get('/', function(req, res) {

  
  let user=req.session.user;

  // product Details getting from database
  productController.viewProduct().then((products) => {
    //console.log(products)
   res.render("user/home",{products,user})
  });
});







//login page
//===========================================================


router.get('/login',(req,res)=>{
  let message=req.flash('message')
  res.render('user/login',{message})
})




router.post('/login',(req,res)=>{
  userController.userlogin(req.body).then((response)=>{
    if(response.status){
     
      req.session.loggedIn=true;
      req.session.user=response.user;
      res.redirect('/')
    }
    else if(response.passwordStaus){
      
      req.flash("message","Password doesnot match")

      res.redirect('/login')
    }else{
      req.flash("message","No user found")
      res.redirect('/login')
    }
  })
})
router.get('/register',(req,res)=>{

  let message=req.flash('message')
  res.render('user/register',{message})
})
router.post('/register',(req,res)=>{
  userController.addUser(req.body).then((response)=>{
    if(!response.status)
    {
      
      //console.log(response)
      if(response.acknowledged)
      {
        req.flash("message","registered successfully")
        res.redirect('/register')
      }
    }
    else{
      req.flash("message","email already exist")
      res.redirect('/register')
    }
 
  })



})




//get cart page
//=================================================================
router.get('/cart',verifyUserLogin,function(req,res){
  let user=req.session.user;
  let totalAmount =0
  //userController.removeFromCart
  userController.getUserCartProductByUserId(user._id).then(async(cartProducts)=>{
    if(cartProducts.length){
      totalAmount=await userController.getTotalAmount(user._id);
    }
  res.render("user/cart",{user,cartProducts,totalAmount})
});
})


//add to cart
//==================================================================

router.get("/addTocart/:id",verifyUserLogin,(req,res)=>{
  let productId=req.params.id;
  let userId=req.session.user._id;
  userController.addToCart(productId,userId).then(()=>{
    // res.json({status:true});
    res.redirect('/')

  })
  
})


//remove from cart
//=======================================
router.get("/removeFromCart/:cartId/:productId",verifyUserLogin,(req,res)=>{
  let productId=req.params.productId;
  let cartId=req.params.cartId;
  
  //console.log(productId)
 // console.log(cartId)
  userController.removeFromCart(cartId,productId).then(()=>{
    // res.json({status:true});
    res.redirect('/cart')

  })
  
})




//place order
//==================================================
router.get('/placeOrder',verifyUserLogin,async(req,res)=>{
  console.log("hiiii")
  let userId=req.session.user._id;
  let user=req.session.user;
  let totalAmount=await userController.getTotalAmount(userId)
  res.render('user/placeOrder',{totalAmount,user})

})


///post place order
//=====================================================

router.post("/placeOrder",async(req,res)=>{
  console.log("hiii")
  // if(!response.status)
  //   {
  let userId=req.session.user._id;
  let product=await userController.getCartProductsByUserId(userId);
  let total=await userController.getTotalAmount(userId)
  console.log("total"+total)
  userController.placeOrder(userId,req.body,product,total).then((orderId)=>{
    console.log(orderId)
    if(req.body["payment-method"]==="COD"){
      console.log("success")
     
      res.json({codSuccess:true}); 
    }
    else{
      console.log("htttt")
      
      userController.generateRazorpay(orderId, total).then((response)=>{
        response.success=false
       console.log(response);
        res.json(response);
      })
    }

  })
// }else{
//     req.flash("message","please add product to cart ")
//     res.redirect('/cart')
//   }
})


// delivery success-----
//==========================================================
router.get("/deliverySuccess",async(req,res)=>{
  //no
  console.log("hi")
  let user=await req.session.user;
  res.render("admin/deliverySuccess",{user})
})



//view place order
//=====================================================
router.get('/viewPlaceorder',verifyUserLogin,(req,res)=>{
  console.log("hiiiiiiiiii")
  let userId=req.session.user._id;
  let user=req.session.user;
  userController.getplaceOrders(userId).then(async(placeorder)=>{
    if(placeorder.length){
      
    }
  res.render("user/viewOrder",{user,placeorder})
});
  })



//verify payement
//==============================================
router.post('/verifypayment',(req,res)=>{
  console.log("verify:")
  userController.verifyPayment(req.body).then(()=>{
    userController.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    res.json({status:false,errMsg:''})
  })
})




/* order success
=============================================================*/
router.get("/orderSuccess",verifyUserLogin, async (req, res) => {
  let user =req.session.user
  res.render("user/orderSuccess", { user });
});



//logout details
//===============================================
router.get("/logout",(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
