
const Crypto = require('./Routes/crypto')
const express = require('express')
const app = express()
const Web3 = require("web3")
const port = 5050
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
let address = '0x07ee55aa48bb72dcc6e9d78256648910de513eca'
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/8d3bc27c75c84c9c9808a57c80c49d86"))
web3.eth.getBalance(address, function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(web3.utils.fromWei(result, "ether") + " ETH")
  }
})

const getTran = async (adr) => {
  try {
    let allTrx = []
    console.log('start')
    for (let index3 = 1500000; index3 <= 1500010; index3++) {

      let result = await web3.eth.getBlock(index3)
      const txn = result.transactions
      let detailTxn = await Promise.all(txn.map(async (item, index) => {
        var transaction = await web3.eth.getTransaction(item)
        if (transaction.from === adr || transaction.to === adr) {
          transaction.value = web3.utils.fromWei(transaction.value, "ether")
          transaction.gasPrice=web3.utils.fromWei(transaction.gasPrice, "ether")  
          let receipt = await web3.eth.getTransactionReceipt(item)
          transaction.gasUsed = receipt.gasUsed
          transaction.time=new Date(result.timestamp*1000)
          transaction.fee=parseFloat(transaction.gasPrice)*transaction.gasUsed
          allTrx.push(transaction)
          return transaction;
        }



      }))
    }
    console.log('end')
    return allTrx;
  }
  catch{
    console.log(err)
  }


}

const getTransaction = async (adr) => {
  let first = Date.now()
  var tran = await getTran(adr)
  let second = Date.now()
  console.log((second - first) / 1000 + ' seconds')
  return tran
}





app.get('/:address', async (req, res) => {
  // res.send('Server up')
  const tran = await getTransaction(req.params.address)
  console.log('wallet: ' + req.params.address)
  res.send(tran)
})

app.listen(port, () => { console.log(`server up on port ${port}`) })