const mongoClient=require("mongodb").MongoClient
const state={db:null}

module.exports.connect=function(done){
    const url='mongodb+srv://anseera:@cluster0.x74g0.mongodb.net/test'
    const dbname = 'texol'
    mongoClient.connect(url,{useUnifiedTopology:true},(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        return done()
    })
}

module.exports.get=function(){
    return state.db
}