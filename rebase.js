const Rebase = require("./build/contracts/Caesar.json");
const Provider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const Web3 = require("web3");
const provider = new Provider(process.env.MNEMONIC, process.env.AVAXTESTNET);
const web3 = new Web3(provider);
const contractAdd = "0x5970EFF1018F15Bb755c4CEc1703B3a7ab6E0d4F";

const contract = new web3.eth.Contract(Rebase.abi, contractAdd);

const rebase = async () => {
  accounts = await web3.eth.getAccounts();
  epoch = Math.floor(Date.now() / 1000);
  circulatingSupply = await contract.methods.getCirculatingSupply().call();
  rewardYield = await contract.methods.rewardYield().call();
  rewardDenom = await contract.methods.rewardYieldDenominator().call();
  supplyDelta = BigInt((circulatingSupply * rewardYield) / rewardDenom);

  const tx = await contract.methods.rebase(epoch,supplyDelta).send({from: accounts[0]});

  var today = new Date();
  console.log("Status: " + tx.status);
  console.log("Epoch: " + epoch);
  console.log("Supply Delta: " + supplyDelta);
  console.log("Time called: " + today);
  console.log("\n");
};

setInterval(rebase, 6000);
