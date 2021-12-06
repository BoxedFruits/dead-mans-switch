const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

async function main() {

  const DeadMansContract = await hre.ethers.getContractFactory("DeadMansContract");
  const deadMansContract = await DeadMansContract.deploy("this is my decryptionKey",2);

  await deadMansContract.deployed();
  console.log("Smart contract deployed to:", deadMansContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
