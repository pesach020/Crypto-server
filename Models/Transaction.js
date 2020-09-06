const mongoose=require('mongoose')
var SchemaTypes = mongoose.Schema.Types

const TrxChoosenSchema=mongoose.Schema({
    
  Hash:String,
  From:String,
  To:String
   

})
module.exports=mongoose.model('TRX',TrxChoosenSchema,'TRX')