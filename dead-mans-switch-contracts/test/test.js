const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeadMansSwitch", function () {
  var dms;
  const decryptionKey = "BingoBango";

  beforeEach(async () => {
    const DMS = await ethers.getContractFactory("DeadMansContract");
    dms = await DMS.deploy(decryptionKey, 1);
    await dms.deployed();
  });

  it("should activate the DMS if the contract is deployed sucessfully", async () => {
    // console.log(timeAndMine);
    expect(await dms.isActive()).to.equal(true);
  });

  // it("should not allow any other user to access the functions", async () => {

  // });

  it("should not get the decryptionKey", async () => {
    expect(dms.getDecryptionKey()).to.revertedWith(Error,'The switch has not been activated yet');
  });

  describe("If the block.timestamp > nextBlockTimeStamp", async () => {
    beforeEach(async () => {
      timeAndMine.setTime(9000000000);
    });

    it("should not be active", async () => {
      expect(await dms.isActive()).to.equal(false);
    });

    it("should get the decryptionKey successfully", async () => {
      timeAndMine.setTime(9100000000)
      expect(await dms.getDecryptionKey()).to.equal(decryptionKey);
    });
  });
});