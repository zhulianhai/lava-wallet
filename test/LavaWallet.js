
import LavaTestUtils from './LavaTestUtils';
var sigUtil = require('eth-sig-util')


var _0xBitcoinToken = artifacts.require("./_0xBitcoinToken.sol");
var LavaWallet = artifacts.require("./LavaWallet.sol");


const ethAbi = require('ethereumjs-abi')
var ethUtil =  require('ethereumjs-util');
var web3utils =  require('web3-utils');

const Tx = require('ethereumjs-tx')
var lavaTestUtils = new LavaTestUtils();

const Web3 = require('web3')
// Instantiate new web3 object pointing toward an Ethereum node.
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

//https://web3js.readthedocs.io/en/1.0/web3-utils.html
//https://medium.com/@valkn0t/3-things-i-learned-this-week-using-solidity-truffle-and-web3-a911c3adc730




contract('LavaWallet', function(accounts) {

  var walletContract ;
  var tokenContract;

    it("can deploy ", async function () {

      console.log( 'deploying wallet' )
        walletContract = await LavaWallet.deployed();



  }),




  it("can mint tokens", async function () {


   tokenContract = await _0xBitcoinToken.deployed();


    await printBalance(accounts[0],tokenContract)

//canoe

//7.3426930413956622283065143620738574142638959639431768834166324387693517887725e+76)


    console.log('contract')

    console.log(tokenContract.address)


    var challenge_number = await tokenContract.getChallengeNumber.call( );



  //  challenge_number = '0x085078f6e3066836445e800334b4186d99567065512edfe78fa7a4f611d51c3d'

  //   var solution_number = 1185888746
  //  var solution_digest = '0x000016d56489592359ce8e8b61ec335aeb7b7dd5695da22e25ab2039e02c8976'

  //  var sress = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';

  var test_account= {
      'address': '0x087964cd8b33ea47c01fbe48b70113ce93481e01',
      'privateKey': 'dca672104f895219692175d87b04483d31f53af8caad1d7348d269b35e21c3df'
  }

    var targetString = await tokenContract.getMiningTarget.call({from: addressFrom});
    var miningTarget = web3utils.toBN(targetString);

    console.log('target',miningTarget)
      console.log('challenge',challenge_number)

    var addressFrom = test_account.address;

    console.log("starting to mine...")

    var solution_number;
    var phraseDigest;

  while(true)
  {
      solution_number = web3utils.randomHex(32)
      phraseDigest = web3utils.soliditySha3(challenge_number, addressFrom, solution_number )

    var digestBytes32 = web3utils.hexToBytes(phraseDigest)
    var digestBigNumber = web3utils.toBN(phraseDigest)


    if ( digestBigNumber.lt(miningTarget)   )
    {
      console.log("found a good solution nonce!", solution_number);

      break;
    }
  }

  console.log('phraseDigest', phraseDigest);  // 0x0007e4c9ad0890ee34f6d98852d24ce6e9cc6ecfad8f2bd39b7c87b05e8e050b

  console.log(solution_number)


  var checkDigest = await tokenContract.getMintDigest.call(solution_number,phraseDigest,challenge_number, {from: addressFrom});

  console.log('checkDigest',checkDigest)

  console.log('target',miningTarget)

  console.log('challenge_number',challenge_number)

  //var checkSuccess = await tokenContract.checkMintSolution.call(solution_number,phraseDigest,challenge_number, target );
  //  console.log('checkSuccess',checkSuccess)

//  var mint_tokens = await tokenContract.mint.call(solution_number,phraseDigest, {from: from_address});
  await submitMintingSolution(tokenContract, solution_number,phraseDigest,test_account);
  // console.log("token mint: " + mint_tokens);


  await printBalance(accounts[0],tokenContract)

  assert.equal(checkDigest, phraseDigest ); //initialized

});


it("can deposit into lava wallet", async function () {


    await printBalance(accounts[0],tokenContract)

    //console.log('tokenContract',tokenContract)
    //console.log('walletContract',walletContract)

//  console.log(tokenContract.address)

    var _0xBitcoinABI = require('../javascript/abi/_0xBitcoinToken.json');
    var LavaWalletABI = require('../javascript/abi/LavaWallet.json');



      var test_account= {
          'address': '0x087964cd8b33ea47c01fbe48b70113ce93481e01',
          'privateKey': 'dca672104f895219692175d87b04483d31f53af8caad1d7348d269b35e21c3df'
      }

      var addressFrom = test_account.address;

      var depositAmount = 500;

      //??
      var remoteCallData = '0x01';

      var txData = web3.eth.abi.encodeFunctionCall({
              name: 'approveAndCall',
              type: 'function',
              inputs: [
                {
                  "name": "spender",
                  "type": "address"
                },
                {
                  "name": "tokens",
                  "type": "uint256"
                },
                {
                  "name": "data",
                  "type": "bytes"
                }],
                outputs: [
                  {
                    "name": "success",
                    "type": "bool"
                  }
              ]
          }, [walletContract.address, depositAmount, remoteCallData]);


          try{
            var txCount = await web3.eth.getTransactionCount(addressFrom);
            console.log('txCount',txCount)
           } catch(error) {  //here goes if someAsyncPromise() rejected}
            console.log(error);

             return error;    //this will result in a resolved promise.
           }

           var addressTo = tokenContract.address;
           var privateKey = test_account.privateKey;

          const txOptions = {
            nonce: web3utils.toHex(txCount),
            gas: web3utils.toHex("1704624"),
            gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
            value: 0,
            to: addressTo,
            from: addressFrom,
            data: txData
          }



        var sentDeposit = await new Promise(function (result,error) {

              sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
              if (err) error(err)
                result(res)
            })

          }.bind(this));


           console.log(sentDeposit)

            var checkDeposit  = await walletContract.balanceOf.call(tokenContract.address,addressFrom, {from: addressFrom});

            var accountBalance = await getBalance(walletContract.address,tokenContract)
            assert.equal(accountBalance.token, 500 );

            assert.equal(checkDeposit.toNumber(), 500 );


            //not working
            console.log('checkDeposit ',checkDeposit.toNumber())

            await printBalance(accounts[0],tokenContract)


            console.log(walletContract.address)
            await printBalance(walletContract.address,tokenContract)

});






it("can sign a lava request", async function () {


    await printBalance(accounts[0],tokenContract)

    var test_account= {
        'address': '0x7104822ff0709d7bcff5017cfe1d6246710aefc2',
        'privateKey': 'd74926a22497deb0f453869d534f22699b79608c5acdd13435b1612a08081889'
    }

    var from = test_account.address;



//var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C'
  var requestRecipient = test_account.address;
    var requestQuantity = 500;


     var requestToken = tokenContract.address;

     var requestNonce = web3utils.randomHex(32);

     var privateKey = test_account.privateKey;


     const msgParams = [

    {
      type: 'address',
      name: 'from',
      value: from
    },
    {
      type: 'address',
      name: 'to',
      value: to
    },
    {
      type: 'address',
      name: 'walletAddress',
      value: walletAddress
    },
    {
      type: 'address',
      name: 'tokenAddress',
      value: tokenAddress
    },
    {
      type: 'uint256',
      name: 'tokenAmount',
      value: tokenAmount
    },
    {
      type: 'uint256',
      name: 'relayerReward',
      value: relayerReward
    },
    {
      type: 'uint256',
      name: 'expires',
      value: expires
    },
    {
      type: 'string',
      name: 'nonce',
      value: nonce
    },
  ]

      var params = [msgParams, from]

      var signature = await this.signTypedData(params,from);
        console.log('lava signature',msgParams,signature)














   var sigHash = web3utils.soliditySha3(requestRecipient, requestQuantity, requestToken, requestNonce)

      console.log(from)

      console.log(sigHash)

      var sigHashHex = Buffer.from(sigHash.substr(2, sigHash.length),'hex');

   var sig = ethUtil.ecsign(sigHashHex, Buffer.from(privateKey,'hex'))




//https://github.com/ukstv/sign-typed-data-test/blob/master/contracts/SignTypedData.sol#L11


//see
//https://github.com/MetaMask/eth-sig-util/blob/master/index.js
// need to implement typedSignatureHash in solidity


/*
{
   type: 'uint32',
   name: 'A number',
   value: '1337'
}
*/

/*
// Solidity example
string message = 'Hi, Alice!';
unit value = 1337;
const hash = keccak256(
  keccak256('string message', 'uint32 A number'),
  keccak256(message, value),
);
address recoveredSignerAddress = ecrecover(hash, v, r, s);
*/





var from = test_account.address
var to = test_account.address
var walletAddress = test_account.address
var tokenAddress = test_account.address
var tokenAmount = 100
var relayerReward = 1
var expires = 999999999
var nonce = 12

const msgParams = [

{
 type: 'address',
 name: 'from',
 value: from
},
{
 type: 'address',
 name: 'to',
 value: to
},
{
 type: 'address',
 name: 'walletAddress',
 value: walletAddress
},
{
 type: 'address',
 name: 'tokenAddress',
 value: tokenAddress
},
{
 type: 'uint256',
 name: 'tokenAmount',
 value: tokenAmount
},
{
 type: 'uint256',
 name: 'relayerReward',
 value: relayerReward
},
{
 type: 'uint256',
 name: 'expires',
 value: expires
},
{
 type: 'uint256',
 name: 'nonce',
 value: nonce
},
]


const testMsgParams = [

{
 type: 'address',
 name: 'from',
 value: '0xb11ca87e32075817c82cc471994943a4290f4a14'
},
{
 type: 'address',
 name: 'to',
 value: '0xb11ca87e32075817c82cc471994943a4290f4a14'
},
{
 type: 'address',
 name: 'walletAddress',
 value: '0xd53f047ceb0dc6cbaf6d09e877a7c3043caf9e7e'
},
{
 type: 'address',
 name: 'tokenAddress',
 value: "0x9d2cc383e677292ed87f63586086cff62a009010"
},
{
 type: 'uint256',
 name: 'tokenAmount',
 value: 0
},
{
 type: 'uint256',
 name: 'relayerReward',
 value: 0
},
{
 type: 'uint256',
 name: 'expires',
 value: 3159739
},
{
 type: 'uint256',
 name: 'nonce',
 value: "0xcb427e37485ce638ad24b9e1125e9"
},
]

//compund hash should be
//     0xb2efb2a45454a62d28bace8669a72b4cf313e0e38018457bd640322a858d3134

/// -> 0xb2efb2a45454a62d28bace8669a72b4cf313e0e38018457bd640322a858d3134

// i need to hardcode the typehash in to solidity!!


       var hash = typedSignatureHash(testMsgParams)

       console.log('hash3', '0x'+ hash.toString('hex') )

       var result = await walletContract.testSignTypedData.call(walletAddress,from,to,tokenAddress,tokenAmount,relayerReward,expires,nonce )

       console.log('hash4', result )
/*
[ { type: 'uint256', name:'amount', value: 0 }, { type: 'address', name:'account', value: '0x000000000 ' } ]

Now in solidity make a hash for the types:

bytes32 typeHash = keccak('uint256 amount', 'address account');

And a hash for the actual values:

bytes32 valueHash =keccak(_amount, _account);

Now you can recover those combined hashes as you would recover a normal sign:

ecrecover(keccak(typeHash, valueHash), v,r,s);
*/









      console.log(sig)

   var recoveredPubkey = ethUtil.ecrecover(sigHashHex, sig.v, sig.r, sig.s);
   console.log('recoveredPubkey',recoveredPubkey)


  var addrBuf = ethUtil.pubToAddress(recoveredPubkey);
  var addr = ethUtil.bufferToHex(addrBuf);

  console.log(addr)

var signature = ethUtil.toRpcSig(sig.v, sig.r, sig.s)

   var txData = web3.eth.abi.encodeFunctionCall({
           name: 'withdrawTokensFrom',
           type: 'function',
           inputs: [
             {
               "name": "from",
               "type": "address"
             },
             {
               "name": "tokens",
               "type": "uint256"
             },
             {
               "name": "token",
               "type": "address"
             },
             {
               "name": "checkNumber",
               "type": "uint256"
             },
             {
               "name": "sigHash",
               "type": "bytes32"
             },
             {
               "name": "signature",
               "type": "bytes"
             }
           ],
             outputs: [
               {
                 "name": "",
                 "type": "bool"
               }
           ]
       }, [requestRecipient, requestQuantity, requestToken, requestNonce, sigHash, signature ]);



       console.log(sig.length);

       try{
         var txCount = await web3.eth.getTransactionCount(addressFrom);
         console.log('txCount',txCount)
        } catch(error) {  //here goes if someAsyncPromise() rejected}
         console.log(error);

          return error;    //this will result in a resolved promise.
        }

           var addressTo = walletContract.address;

      const txOptions = {
         nonce: web3utils.toHex(txCount),
         gas: web3utils.toHex("1704624"),
         gasPrice: web3utils.toHex(web3utils.toWei("4", 'gwei') ),
         value: 0,
         to: addressTo,
         from: addressFrom,
         data: txData
       }



     var sentWithdraw = await new Promise(function (result,error) {

           sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
           if (err) error(err)
             result(res)
         })

       }.bind(this));

       console.log(sentWithdraw);

       await printBalance(accounts[0],tokenContract)

});


/*
  assert.equal(10, good_type_record[4].toNumber() ); //check price

  var typeId =  web3utils.toBN(good_type_record[0] );

  console.log("typeId: " + typeId);

  //var result = contract.claimGood(typeId, {value: web3utils.toWei('1')});

  var ethBalance = await web3.eth.getBalance(accounts[0]);
   console.log("Account 0 has " + ethBalance + " Wei");

//console.log( web3utils.toWei('40','ether').toString() );

var result =   await contract.claimGood(  typeId , function(){} ,{ value:web3utils.toWei('0.00001','ether') })

//web3utils.keccak256(typeId + '|' + instanceId)

  var instanceId = 0;
  var token_id = await tokenContract.buildTokenId(typeId,instanceId,function(){})

  var token_record = await tokenContract.tokenOwner(token_id);

    console.log('token record ')
      console.log(token_id)
  console.log(token_record)*/
//  assert.equal(true, result );
//  await contract.claimGood(typeId).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',value: 1000});//,{value: 1000}
//  var token_record = await contract.goods.call(typeId);

//  assert.equal(true, token_record ); //initialized


/*
it("can bid on the market", async function () {

  var tokenContract = await GoodToken.deployed();
  var marketContract = await TokenMarket.deployed();
  var contract = await EtherGoods.deployed();

  await marketContract.setTokenContractAddress(accounts[0],tokenContract);
  await contract.setMarketContractAddress(accounts[0],marketContract);
  await contract.setTokenContractAddress(accounts[0],tokenContract);
  await tokenContract.setMasterContractAddress(accounts[0],contract)





}),




  it("can not get supply while supply all taken", async function () {
      var contract = await EtherGoods.deployed();
      var balance = await contract.balanceOf.call(accounts[0]);
      console.log("Pre Balance: " + balance);

      var allAssigned = await contract.allPunksAssigned.call();
      console.log("All assigned: " + allAssigned);
      assert.equal(false, allAssigned, "allAssigned should be false to start.");
      await expectThrow(contract.getPunk(0));
      var balance = await contract.balanceOf.call(accounts[0]);
      console.log("Balance after fail: " + balance);
    });



  */
});



function typedSignatureHash(typedData) {
  const error = new Error('Expect argument to be non-empty array')
  if (typeof typedData !== 'object' || !typedData.length) throw error

  const data = typedData.map(function (e) {
    return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
  })
  const types = typedData.map(function (e) { return e.type })
  const schema = typedData.map(function (e) {
    if (!e.name) throw error
    return e.type + ' ' + e.name
  })



console.log('schema',new Array(typedData.length).fill('string'),schema)
  console.log('schema subhash',ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema).toString('hex'))

  console.log('types',types, data)
  console.log('types subhash',ethAbi.soliditySHA3(types, data).toString('hex'))


  console.log("hash1", ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
      ethAbi.soliditySHA3(types, data)
    ]
  ))

  //need to hardcode the 0x64fcd ... into solidity !!
  console.log("hash2", ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3',
      ethAbi.soliditySHA3(types, data)
    ]
  ))


  return ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
      ethAbi.soliditySHA3(types, data)
    ]
  )
}



async function getBalance (account ,tokenContract)
{
      var balance_eth = await (web3.eth.getBalance(account ));
     var balance_token = await tokenContract.balanceOf.call(account , {from: account });

     return {ether: web3utils.fromWei(balance_eth.toString(), 'ether'), token: balance_token.toNumber() };

 }

 async function printBalance (account ,tokenContract)
 {
       var balance_eth = await (web3.eth.getBalance(account ));
      var balance_token = await tokenContract.balanceOf.call(account , {from: account });

      console.log('acct balance', account, web3utils.fromWei(balance_eth.toString() , 'ether')  , balance_token.toNumber())

  }


 async function submitMintingSolution(tokenContract, nonce,digest, account)
 {

//   console.log('tokenContract',tokenContract);



   var addressTo =  tokenContract.address;
   var addressFrom = account.address;


  try{
    var txCount = await  web3.eth.getTransactionCount(addressFrom);
    console.log('txCount',txCount)
   } catch(error) {  //here goes if someAsyncPromise() rejected}
    console.log(error);
      this.miningLogger.appendToErrorLog(error)
     return error;    //this will result in a resolved promise.
   }




    var txData =  web3.eth.abi.encodeFunctionCall({
            name: 'mint',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: 'nonce'
            },{
                type: 'bytes32',
                name: 'challenge_digest'
            }]
        }, [nonce, digest]);



    var max_gas_cost = 1704624;

  //  var mintMethod =  tokenContract.mint(nonce,digest);

  //  var estimatedGasCost = await mintMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });

  console.log(tokenContract);

  var estimatedGasCost = 1704623

    console.log('estimatedGasCost',estimatedGasCost);
    console.log('txData',txData);

    console.log('addressFrom',addressFrom);
    console.log('addressTo',addressTo);



    if( estimatedGasCost > max_gas_cost){
      console.log("Gas estimate too high!  Something went wrong ")
      return;
    }


    const txOptions = {
      nonce: web3utils.toHex(txCount),
      gas: web3utils.toHex(estimatedGasCost),   //?
      gasPrice: web3utils.toHex(3),
      value: 0,
      to: addressTo,
      from: addressFrom,
      data: txData
    }



  return new Promise(function (result,error) {

       sendSignedRawTransaction( web3,txOptions,addressFrom,account.privateKey, function(err, res) {
        if (err) error(err)
          result(res)
      })

    }.bind(this));


 }

 async function sendSignedRawTransaction(web3,txOptions,addressFrom,fullPrivKey,callback) {


   var privKey = truncate0xFromString( fullPrivKey )

   const privateKey = new Buffer( privKey, 'hex')
   const transaction = new Tx(txOptions)


   transaction.sign(privateKey)


   const serializedTx = transaction.serialize().toString('hex')

     try
     {
       var result =  web3.eth.sendSignedTransaction('0x' + serializedTx, callback)
     }catch(e)
     {
       console.log(e);
     }
 }


  function truncate0xFromString(s)
 {

   if(s.startsWith('0x')){
     return s.substring(2);
   }
   return s;
 }
