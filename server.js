
const Crypto = require('./Routes/crypto')
const converter = require('hex2dec')
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
const getToken = (input) => {
  let sign = input.slice(0, 10)
  let addTo = input.slice(11, 74)
  let amount = input.slice(75,)
  amount = converter.hexToDec(amount)
  return (amount)
}
const getTran = async (adr) => {
  try {
    let allTrx = []
    console.log('start')
    for (let index3 = 10000000; index3 <= 10000000; index3++) {
      let result = await web3.eth.getBlock(index3)

      const txn = result.transactions
      //console.log(txn)
      let detailTxn = await Promise.all(txn.map(async (item, index) => {
        var transaction = await web3.eth.getTransaction(item)
        if (transaction.to !== null)//a point that a contact is made 
          if ((transaction.from.toLowerCase() === adr.toLowerCase() || transaction.to.toLowerCase() === adr.toLowerCase())) {
            if (parseInt(transaction.value) === 0) {
              transaction.value = getToken(transaction.input)
            }
            else
              transaction.value = web3.utils.fromWei(transaction.value, "ether")
            transaction.gasPrice = web3.utils.fromWei(transaction.gasPrice, "ether")
            let receipt = await web3.eth.getTransactionReceipt(item)
            transaction.gasUsed = receipt.gasUsed
            transaction.time = result.timestamp * 1000
            transaction.fee = parseFloat(transaction.gasPrice) * transaction.gasUsed
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



const getToken1 = async () => {
  const toknAddress = '0x68d57c9a1c35f63e2c83ee8e49a64e9d70528d25' //sirin
  let txHash = '0x6125e1cc4b445ec8302885338548b3ac6adb615fae130edf732a0a7b1275035e'
  let walletAddress = '0x6748f50f686bfbca6fe8ad62b22228b87f31ff2b'
  let minABI = [
    // balanceOf
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "type": "function"
    },
    // decimals
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "type": "function"
    }
  ];
  let contract = new web3.eth.Contract(minABI, toknAddress)
  let balance = await contract.methods.balanceOf(walletAddress).call();
  return balance
}

app.get('/:address', async (req, res) => {
  // res.send('Server up')
  const tran = await getTransaction(req.params.address)
  console.log('wallet: ' + req.params.address)
  res.send(tran)
  //let token=await getToken()
  // console.log(token)
  // let txHash = '0x6125e1cc4b445ec8302885338548b3ac6adb615fae130edf732a0a7b1275035e'
  // let trx = await web3.eth.getTransaction(txHash)
  //let input = trx.input
  //let amount=getToken(input)
  // console.log(amount)
  //  let trx = await web3.eth.getTransaction('0xdce086015c3651dbd6839f5de94b5a40d1b558115bfc1b7322c9b34376bcfbe3')
  //  console.log(trx)
  //  let input=trx.input
  //  let amount=getToken(input)
  //  console.log(amount)

})

app.listen(port, () => { console.log(`server up on port ${port}`) })