const converter = require('hex2dec')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
var handlebars = require('express-handlebars')
  .create({ defaultLayout:'main' });
const Web3 = require("web3")
const postTran = require('./Models/Transaction')
const port =process.env.PORT|| 5050
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
let address = '0x07ee55aa48bb72dcc6e9d78256648910de513eca'
mongoose.connect('mongodb+srv://orbb92:e8949881@cluster0-jihpp.mongodb.net/CRYPTO?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {

})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function callback() {
  console.log("connected to db");
});
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/8d3bc27c75c84c9c9808a57c80c49d86"))

const minABI = [
  // balanceOf
  {
    "constant": true,
    "inputs": [{
      "name": "_owner",
      "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
      "name": "balance",
      "type": "uint256"
    }],
    "type": "function"
  },
  // decimals
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
      "name": "",
      "type": "uint8"
    }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": false,
    "inputs": [{
      "name": "_to",
      "type": "address"
    }, {
      "name": "_value",
      "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_owner",
      "type": "address"
    }, {
      "name": "_spender",
      "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "_from",
      "type": "address"
    }, {
      "indexed": true,
      "name": "_to",
      "type": "address"
    }, {
      "indexed": false,
      "name": "_value",
      "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
  }, {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "_owner",
      "type": "address"
    }, {
      "indexed": true,
      "name": "_spender",
      "type": "address"
    }, {
      "indexed": false,
      "name": "_value",
      "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
  }
];

const getToken = async (input, tokenadd) => {
  let sign = input.slice(0, 10)
  let addTo = input.slice(34, 74)

  let amount = input.slice(75, )
  amount = converter.hexToDec(amount)
  const toknAddress = '0x68d57c9a1c35f63e2c83ee8e49a64e9d70528d25' //sirin

  let contract = new web3.eth.Contract(minABI, tokenadd)

  let name = await contract.methods.symbol().call()
  return ({
    amount,
    name
  })
}

//0xa6b38ca48d6604a4cf92a45f23c702bd6bffa00e9c888f84c2b42f56214eb768

//10000000
// 0x4a9bfca68519f9a83c5792c14ea986b81d187416 usdt 
const getTran = async (adr) => {
  try {
    let allTrx = []
    console.log('start')
    for (let index3 = 1500000; index3 <= 1500010; index3++) {
      let result = await web3.eth.getBlock(index3)

      const txn = result.transactions
      //console.log(txn)
      let detailTxn = await Promise.all(txn.map(async (item, index) => {
        var transaction = await web3.eth.getTransaction(item)

        if (transaction.to !== null) //a point that a contact is made 
          if ((transaction.from.toLowerCase() === adr.toLowerCase() || transaction.to.toLowerCase() === adr.toLowerCase())) {
            if (parseInt(transaction.value) === 0) {
              let res = await getToken(transaction.input, transaction.to)
              transaction.value = res.amount
              transaction.token = res.name
            } else
              transaction.value = web3.utils.fromWei(transaction.value, "ether")
            transaction.gasPrice = web3.utils.fromWei(transaction.gasPrice, "ether")
            let receipt = await web3.eth.getTransactionReceipt(item)
            transaction.gasUsed = receipt.gasUsed
            transaction.timestamp = result.timestamp * 1000
            transaction.time = new Date(transaction.timestamp)
            transaction.fee = parseFloat(transaction.gasPrice) * transaction.gasUsed
            allTrx.push(transaction)
            return transaction;
          }



      }))
    }
    console.log('end')
    return allTrx;
  } catch {
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
  // let txHash = '0x6125e1cc4b445ec8302885338548b3ac6adb615fae130edf732a0a7b1275035e'
  //let walletAddress = '0x6748f50f686bfbca6fe8ad62b22228b87f31ff2b'
  let minABI = [
    // balanceOf
    {
      "constant": true,
      "inputs": [{
        "name": "_owner",
        "type": "address"
      }],
      "name": "balanceOf",
      "outputs": [{
        "name": "balance",
        "type": "uint256"
      }],
      "type": "function"
    },
    // decimals
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{
        "name": "",
        "type": "uint8"
      }],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{
        "name": "",
        "type": "string"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
  let contract = new web3.eth.Contract(minABI, toknAddress)
  // let balance = await contract.methods.balanceOf(walletAddress).call();
  let name = await contract.methods.name().call()
  // let name = await contract.methods.name().call()
  return name
}

app.get('/:address', async (req, res) => {
  // res.send('Server up')
  const tran = await getTransaction(req.params.address)
  console.log('wallet: ' + req.params.address)
  res.send(tran)

})


const postTransaction = (trx) => {
  const postTrx = new postTran({
    Hash: trx.hash,
    From: trx.from,
    To: trx.to
  })
  postTrx.save()
    .then(data => {
      // res.json(data)
    })
    .catch(err => {
      res.json({
        message: err
      })
    })
}



const postTrx = async () => {
  try {
    let allTrx = []
    console.log('start')
    for (let index3 = 450000; index3 <= 500000; index3++) {
      let result = await web3.eth.getBlock(index3)
      console.log(index3)
      const txn = result.transactions
      //console.log(txn)
      let detailTxn = await Promise.all(txn.map(async (item, index) => {
        try {
          var transaction = await web3.eth.getTransaction(item)

          if (transaction.to !== null) //a point that a contact is made 
            transaction.to = transaction.to.toLowerCase()
          if (parseInt(transaction.value) === 0) {
            let res = await getToken(transaction.input, transaction.to)
            transaction.value = res.amount
            transaction.token = res.name
          } else
            transaction.value = web3.utils.fromWei(transaction.value, "ether")
          transaction.gasPrice = web3.utils.fromWei(transaction.gasPrice, "ether")
          let receipt = await web3.eth.getTransactionReceipt(item)
          transaction.gasUsed = receipt.gasUsed
          transaction.timestamp = result.timestamp * 1000
          //transaction.time = new Date(transaction.timestamp)
          transaction.fee = parseFloat(transaction.gasPrice) * transaction.gasUsed
          allTrx.push(transaction)
          transaction.from = transaction.from.toLowerCase()
          transaction.hash = transaction.hash.toLowerCase()


           postTransaction(transaction)
          return transaction;
        } catch (err) {
          var transaction = await web3.eth.getTransaction(item)

          if (transaction.to !== null) //a point that a contact is made 
            transaction.to = transaction.to.toLowerCase()


          transaction.value = web3.utils.fromWei(transaction.value, "ether")
          transaction.gasPrice = web3.utils.fromWei(transaction.gasPrice, "ether")
          let receipt = await web3.eth.getTransactionReceipt(item)
          transaction.gasUsed = receipt.gasUsed
          transaction.timestamp = result.timestamp * 1000
          //transaction.time = new Date(transaction.timestamp)
          transaction.fee = parseFloat(transaction.gasPrice) * transaction.gasUsed
          allTrx.push(transaction)
          transaction.from = transaction.from.toLowerCase()
          transaction.hash = transaction.hash.toLowerCase()
          postTransaction(transaction)

          return transaction;
        }



      }))
    }
    console.log('end')
    return allTrx;
  } catch {
    console.log(err)
  }

}
app.get('/', async (req, res) => {
 // let hello = await postTrx()
  //console.log(hello)
})

app.listen(port, () => {
  console.log(`server up on port ${port}`)
})