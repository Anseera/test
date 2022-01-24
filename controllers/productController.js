const { response } = require('../app')
const db=require('../config/connection')
const objectId=require("mongodb").ObjectId
const bcrypt=require('bcrypt')
var fs = require('fs');
module.exports={

    /*insert product details
    =======================================================*/
    addProduct:(productDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let response={};
             let productid=await db.get().collection('product').findOne({product_id:productDetails.product_id})
            if(!productid){
                db.get().collection('product').insertOne(productDetails).then((response)=>{
                resolve(response)
                })
            }
            else
            {
               resolve({status:true});
            }
        })
    },

    /*insert warehouse details
    =======================================================*/
    warehouse:(warehouseDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let response={};
             let whnor=await db.get().collection('warehouse').findOne({warehouse_number:warehouseDetails.warehouse_number})
            if(!whnor){
                db.get().collection('warehouse').insertOne(warehouseDetails).then((response)=>{
                resolve(response)
                })
            }
            else
            {               
               resolve({status:true});
            }
        })
    },

    /*get product details
    =======================================================*/
    viewProduct:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection('product').find().toArray();
            resolve(products)
        })
    },

    /*upadate product details
    =======================================================*/
    updateproduct:(details,id)=>{        
        return new Promise(async(resolve,reject)=>{
        let pdtls=await db.get().collection('product').findOne({_id:objectId(id)})
        db.get().collection('product').updateOne({_id:objectId(id)},
            {$set:{product_id:details.product_id,name:details.name},}
            ).then((response)=>{
                resolve({updateStatus:true})
            })
        })
    },

    /*get product by id
    =======================================================*/
    getproductByid:(id)=>{
        return new Promise(async(resolve,reject)=>{
           let products=await db.get().collection('product').findOne({_id:objectId(id)})
           resolve(products)
        })
    },

    /*get warehouses details
    =======================================================*/
    viewWarehouse:()=>{      
        return new Promise(async(resolve,reject)=>{
            let warehouse=await db.get().collection('warehouse').find().toArray();
            resolve(warehouse)
        })
    },

    /*add stock details
    =======================================================*/
    addStock:(stockDetails)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection('stock').insertOne(stockDetails).then((response)=>{
                resolve(response)
        })
    })
    },

    /*view stock details
    =======================================================*/

    getstock:()=>{
        return new Promise(async(resolve,reject)=>{
            let stockProducts=await db.get().collection('stock').
            aggregate([
                {
                    $lookup:{
                        from:'product',
                        localField:"product_id",
                        foreignField:"product_id",
                        as:"productDetails",
                    },                    
                },                
                {
                    $unwind:"$productDetails",
                },
            ]).toArray()
            resolve(stockProducts)
        })
    },

    /*ustock quantity
    =======================================================*/
    unstockqty:(stockId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection('stock').updateOne({_id:objectId(stockId)},
            {$set:{quantity:0},}
            ).then((response)=>{
                resolve({updateStatus:true})
            })    
        })
    },

     /*get warehouses by id
    =======================================================*/
    getwarehousesByid:(id)=>{
        return new Promise(async(resolve,reject)=>{
           let warehouses=await db.get().collection('warehouse').findOne({_id:objectId(id)})
           resolve(warehouses)
        })
    },

     /*upadate Warehouses details
    =======================================================*/
    upadateWarehouses:(details,id)=>{        
        return new Promise(async(resolve,reject)=>{
        db.get().collection('warehouse').updateOne({_id:objectId(id)},
            {$set:{warehouse_number:details.warehouse_number,stock_limit:details.stock_limit},}
            ).then((response)=>{
                resolve({updateStatus:true})
            })
        })
    },

     /*get stock by id
    =======================================================*/
    getstockByid:(id)=>{
        return new Promise(async(resolve,reject)=>{
           let stock=await db.get().collection('stock').findOne({_id:objectId(id)})
           console.log(stock)
           resolve(stock)
        })
    },
     /*upadate stock details
    =======================================================*/
    updateStock:(details,id)=>{        
        return new Promise(async(resolve,reject)=>{
        db.get().collection('stock').updateOne({_id:objectId(id)},
            {$set:{product_id:details.product_id,warehouse_number:details.warehouse_number,quantity:details.quantity},}
            ).then((response)=>{
                resolve({updateStatus:true})
            })
        })
    },
}
