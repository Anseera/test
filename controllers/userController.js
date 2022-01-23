const router = require('../app')
const db=require('../config/connection')
const objectId=require("mongodb").ObjectId
const bcrypt=require('bcrypt')
const Razorpay=require('razorpay')
var instance=new Razorpay({ key_id:'rzp_test_0C8igtjvuHQfqO',key_secret:'KVlLCmWMsohE3oHcQUc0UFqZ'})//give key and secret from razorpay here
module.exports={
    //register user
    //======================================
    addUser:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{

            userDetails.password=await bcrypt.hash(userDetails.password,10)
            //console.log(userDetails.password)
            
            //console.log(userDetails.email)
          let user=await db.get().collection('user').findOne({email:userDetails.email})
        //console.log(user)
          if(!user){
          db.get().collection('user').insertOne(userDetails).then((response)=>{
            
            resolve(response)
        })
         }
         else
         {
            //response.statusnnn = false;
            resolve({status:true});
         }
        
    })


    },
    //login
    //=============================
    userlogin:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let response={};
           // console.log("nabas"+userDetails.email)
            let user=await db.get().collection('user').findOne({email:userDetails.email})
          //  console.log("aa"+user)
            if(user){
                bcrypt.compare(userDetails.password,user.password).then((status)=>{
                    if(status){
                        response.user=user;
                        response.status=true;
                        resolve(response);

                    }else{
                        response.passwordStaus=true;
                        resolve(response)
                    }

                })
            }else{
                response.userStatus=false;
                resolve(response)
            }

        })
    },
    //view user
    //==========================================================================
    viewUser:()=>{

        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection('user').find().toArray();
            //console.log(users+'kkk')
            resolve(users)
        })

    },
    // delete user
    // ===============================================
    deleteuserbyid:(id)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection('user').deleteOne({_id:objectId(id)}).then((data)=>{
                resolve(data)
            })
        })
    },
    getuserbyid:(id)=>{
        return new Promise(async(resolve,reject)=>{
           let users=await db.get().collection('user').findOne({_id:objectId(id)})
        //    console.log(products)
           resolve(users)
        })
    },
    UpdateUserdetails:(details,id)=>{
      //  console.log(details)
        return new Promise(async(resolve,reject)=>{
             db.get().collection('user').updateOne({_id:objectId(id)},
            {$set:{name:details.name,
                email:details.email,
                password:details.password
            },
        }
        ).then((response) =>{
            resolve({updateStatus:true});
        })

       })
    
    },
    //add to cart
    //=================================================
    addToCart: (productId,userId) => {
        return new Promise(async (resolve, reject) => {
            let proObj = {
                productId: objectId(productId),
                quantity: 1,
            };

            let userCart = await db
                .get()
                .collection("cart")
                .findOne({ userId: objectId(userId) });
              console.log(userCart)
            if (userCart) {
                    let productExist=userCart.products.findIndex((product)=>product.productId==productId);
                    console.log("productExist:"+productExist)
                    if(productExist!=-1){
                        db.get().
                        collection("cart").
                        updateOne(
                            {
                                userId:objectId(userId),"products.productId":objectId(productId)
                            },
                            
                            {
                                $inc:{"products.$.quantity":1},
                            }
                        )
                        .then(()=>{
                            resolve();
                        });
                    }
                    else{
                       // console.log(proObj)
                        db.get().
                        collection('cart').updateOne(
                            {userId:objectId(userId)},
                            {$push:{products:proObj},
                        }
                        ).then((response)=>{
                            resolve();
                        });
                    }

                
            } else {

                let cartObj = {
                    userId: objectId(userId),
                    products: [proObj],
                };
                db.get()
                    .collection("cart")
                    .insertOne(cartObj)
                    .then((response) => {
    
                        resolve();
                    });
            }
        });
    },

    //view cart
    //===========================================================
    getUserCartProductByUserId:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartProducts=await db.get().collection('cart').
            aggregate([
                {
                        $match:{userId:objectId(userId)},
                },
                {
                        $unwind:"$products",
                },
                {
                    $lookup:{
                        from:'product',
                        localField:"products.productId",
                        foreignField:"_id",
                        as:"productDetails",
                      
                        


                    },
                    
                },
              
                {
                    $unwind:"$productDetails",
                },
              
                
              
            ]).toArray()
            // console.log(cartProducts)
            resolve(cartProducts)

        })


    },
    ////get total amoun
    //======================================================
    getTotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            
            let totalAmount=await db.get().collection('cart').
           
            aggregate([
                {
                        $match:{userId:objectId(userId)},
                },
                {
                        $unwind:"$products",
                },
                {
                    $lookup:{
                        from:'product',
                        localField:"products.productId",
                        foreignField:"_id",
                        as:"productDetails",
                      
                        


                    },

                    
                },
              
                {
                    $unwind:"$productDetails",
                },
                {
                    $group:{
                        _id:"$_id",
                        total:{ $sum:{ $multiply:["$products.quantity","$productDetails.price"]}},
                    },
                },
              
                
              
            ]).toArray()
            // console.log(cartProducts)
        console.log(totalAmount[0].total)
          
            resolve(totalAmount[0].total)
        
       
        })

    },
    
   /*Remove item from cart
    ============================================= */
    removeFromCart: (cartId,productId) => {
        try {           
            return new Promise(async(resolve, reject) => {
                let cartSize =await db
                    .get()
                    .collection('cart')
                    .aggregate([
                        {
                            $match: { _id: objectId(cartId) },
                        },
                        
                        {
                            $project: {
                                sizeOfArray: { $size: "$products" },
                            },
                        },
                    ])
                    .toArray();              
            let count = cartSize[0].sizeOfArray
                    if (count > 1) {                     
                        db.get()
                            .collection('cart')
                            .updateOne(
                                { _id: objectId(cartId) },
                                {
                                    $pull: { products: { productId: objectId(productId) },},
                                }
                            )
                            .then(() => {
                                resolve();
                            });
                    } else {                     
                        db.get()
                            .collection('cart')
                            .deleteOne({ _id: objectId(cartId) })
                            .then(() => {
                                resolve();
                            });
                    }
              
            });
        } catch (err) {
            console.log(err);
        }
    },

    //get product from cart
    //====================================================
    getCartProductsByUserId:(userId)=>{
        return new Promise(async(resolve,reje)=>{
            let cartProducts=await db.get().collection("cart").aggregate([
                {
                    $match:{userId:objectId(userId)},
                },
                {
                    $unwind:"$products",
                },
                {
                    $project:{
                        _id:1,
                        productId:"$products.productId",
                        quantity:"$products.quantity",
                    },
                },
            ]).toArray()
            resolve(cartProducts);
        })

    },
    ///place ordr-------
    placeOrder:(userId,order,products,total)=>{
        return new Promise((resolve,reject)=>{
            let status=order["payment-method"]==="COD"?"placed":"pending";
            let ordrobj={
                deliveryDetails:{
                    mobile:order.mobile,
                    address:order.address,
                    pincode:order.pincode,
                },
                userId: objectId(userId),
                paymentMethod:order["payment-method"],
                products:products,
                totalAmount:total,
                status:status,
                date:new Date(),
            };
            db.get().collection('order').insertOne(ordrobj).then(async(response)=>{
                await db.get().collection("cart").deleteOne({userId:objectId(userId)})
                console.log("kiii"+response.insertedId)
                resolve(response.insertedId)
  
         })
        })
    },


    //get place order
    //==================================
    
    
    getplaceOrders:(userId)=>{

        return new Promise(async(resolve,reject)=>{
            console.log(userId)
            
            let placeorder=await db.get().collection("order").aggregate([
                {
                    $match:{userId:objectId(userId)},
                },
                {
                    $unwind:"$products",
                },
                {
                    $lookup:{
                        from:'product',
                        localField:"products.productId",
                        foreignField:"_id",
                        as:"productDetails",
                      
                        



                    },
                    
                },
              
                {
                    $unwind:"$productDetails",
                },
              
                
              
            ]).toArray()
            console.log('0000')
            
          console.log(placeorder)
            resolve(placeorder)


        })
            


    },
    /*Generate razorpay details
    ============================================= */
    generateRazorpay:(orderId,total)=>{
        console.log("11111")
        return new Promise((resolve,reject)=>{
           // console.log("orderee"+orderId+total)
            var options = {
                amount:total*100,//amount in the smallest currency unit
                currency:"INR",
                receipt:""+orderId,
            };
            instance.orders.create(options,function (err, order){
                if(err){
                    console.log('1234')
                console.log(err)
                }else{
                    console.log('00000')
                    console.log("order:"+order)
                    console.log(JSON.stringify(order))
                    resolve(order)

                }
            })
        })
    },
    //verify signature id using algorithm
    //===============================================================
    verifyPayment: (details) => {
        console.log("helloo")
        return new Promise((resolve,reject)=>{
            const crypto=require("crypto");
            let hmac=crypto.createHmac("sha256","KVlLCmWMsohE3oHcQUc0UFqZ");//give key secret from razorpay here
            hmac.update(details["order[id]"]+"|"+details["payment[razorpay_payment_id]"]);
            hmac=hmac.digest("hex")
            console.log("razorpay_signatue:::",details['payment[razorpay_signature]'])
          
            if (hmac == details["payment[razorpay_signature]"]) {
                console.log("Payment success")
                resolve();
            } else {
                console.log("Payment failed")
                reject();
            }
    

        })
    },
     /*Change the payment status of customer
    ============================================= */
    changePaymentStatus:(orderId)=>{
        try{
            return new Promise((resolve,reject)=>{
                db.get().collection('order').updateOne({_id:objectId(orderId)},
                {
                    $set:{
                    status:"placed",
                },
            },
            )
            .then(()=>{
                resolve();
            });
            })
            
        }catch(err){
            console.log(err);
        }
        },
        //view all placed orders
        //======================================================
        getallorders:()=>{

            return new Promise(async(resolve,reject)=>{
                let orderss=await db.get().collection("order").aggregate([
                    {
                        $match:{status:"placed"},
                    },
                    {
                        $unwind:"$products",
                    },
                    {
                        $lookup:{

                            from:'product',
                            localField:"products.productId",
                            foreignField:"_id",
                            as:"productDetails",
                          
                            
    
    
                        },
                    },
              
                    {
                        $unwind:"$productDetails",
                    },
                  
                  
                        
                ]).toArray()
                // console.log(orderss)
               
                resolve(orderss);
               
            })
    
        },
         //view  order list
    //==================================
    
    
    vieworderDetails:(orderId)=>{

        return new Promise(async(resolve,reject)=>{
           
            console.log("hiiiii")
            let orderlist=await db.get().collection("order").aggregate([
                {
                    $match:{_id:objectId(orderId)},
                },

                {
                    $unwind:"$products",
                },
                {
                    $lookup:{
                        from:'product',
                        localField:"products.productId",
                        foreignField:"_id",
                        as:"productDetails",
                      
                        
                        


                    },
                    
                },
              
                {
                    $unwind:"$productDetails",
                },
                {
                        $lookup:{
                            from:'user',
                            localField:"userId",
                            foreignField:"_id",
                            as:"userDetails",
                          
                            
    
    
                        },
                    },
              
                    {
                        $unwind:"$userDetails",
                    },
                
              
            ]).toArray()
            console.log('0000')
            
          console.log("aaaa"+orderlist)
          console.log(JSON.stringify(orderlist))
            resolve(orderlist)


        })
            


    },


    //delivery list-------------
     //======================================================
     deliverylist:()=>{

            return new Promise(async(resolve,reject)=>{
                let orderss=await db.get().collection("order").aggregate([
                    {
                        $match:{status:"delivered"},
                    },
                    {
                        $unwind:"$products",
                    },
                    {
                        $lookup:{

                            from:'product',
                            localField:"products.productId",
                            foreignField:"_id",
                            as:"productDetails",
                          
                            
    
    
                        },
                    },
              
                    {
                        $unwind:"$productDetails",
                    },
                  
                  
                        
                ]).toArray()
                // console.log(orderss)
               
                resolve(orderss);
               
            })
    
        },
    
    /*Change the delivered status of customer
    ============================================= */
    updatedeliveredStatus:(orderId)=>{
        try{
            return new Promise((resolve,reject)=>{
                db.get().collection('order').updateOne({_id:objectId(orderId)},
                {
                    $set:{
                    status:"delivered",
                },
            },
            )
            .then(()=>{
                resolve();
            });
            })
            
        }catch(err){
            console.log(err);
        }
        },


};
