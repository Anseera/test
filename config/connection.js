const mongoClient=require("mongodb").MongoClient
const state={db:null}

module.exports.connect=function(done){
    const url='mongodb://localhost:27017'
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