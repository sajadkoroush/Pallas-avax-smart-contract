//const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Token = artifacts.require("Caesar");
const Router = artifacts.require("IPangolinRouter");
const currTime = Number(Math.round(new Date().getTime() / 1000));

module.exports = async function (deployer, network, accounts) {

  const router = "0x2D99ABD9008Dc933ff5c0CD271B88309593aB921";
  const autoliq = accounts[1];
  const treasury = accounts[0];
  const riskFree = accounts[3];

  await deployer.deploy(Token,router,autoliq,treasury,riskFree);

  let tokenInstance = await Token.deployed();

  await addLiq(tokenInstance, treasury);

};

const addLiq = async (tokenInstance, account) => {

  const routerInstance = await Router.at(
    "0x2D99ABD9008Dc933ff5c0CD271B88309593aB921"
  );
  
  let supply = await tokenInstance.totalSupply();
  await tokenInstance.approve(routerInstance.address, BigInt(supply), {
    from: account,
  });

  await routerInstance.addLiquidityAVAX(
    tokenInstance.address,
    BigInt(supply / 2),
    0,
    0,
    routerInstance.address,
    currTime + 100,
    { value: 1e17, from: account }
  );

}
