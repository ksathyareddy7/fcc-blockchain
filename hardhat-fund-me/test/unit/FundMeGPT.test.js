const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Withdraw function", function () {
  let contract;
  let owner;
  let funder1;
  let funder2;
  const sendValue1 = ethers.utils.parseEther("1");
  const sendValue2 = ethers.utils.parseEther("1.1");

  beforeEach(async function () {
    // Deploy the contract and get the owner and funders

    [owner, funder1, funder2] = await ethers.getSigners();
    contract = await ethers.getContract("FundMe", owner);
    await contract.deployed();
  });

  it("should revert if called by a non-owner", async function () {
    await expect(contract.connect(funder1).withdraw()).to.be.revertedWith(
      "FundMe__NotOwner"
    );
  });

  it("should set the amount funded by each funder to 0", async function () {
    // Fund the contract by funder1 and funder2
    await contract.connect(funder1).fund({ value: sendValue1 });
    await contract.connect(funder2).fund({ value: sendValue2 });

    // Call the withdraw function
    await contract.connect(owner).withdraw();

    // Check that the amount funded by each funder is set to 0
    expect(await contract.addressToAmountFunded(funder1.address)).to.equal(0);
    expect(await contract.addressToAmountFunded(funder2.address)).to.equal(0);
  });

  it("should clear the list of funders", async function () {
    // Fund the contract by funder1 and funder2
    await contract.connect(funder1).fund({ value: sendValue1 });
    await contract.connect(funder2).fund({ value: sendValue2 });

    // Call the withdraw function
    await contract.connect(owner).withdraw();

    // Check that the list of funders is empty
    await expect(contract.funders(0)).to.be.reverted;
  });

  it("should transfer the contract balance to the owner", async function () {
    // Fund the contract by funder1 and funder2
    await contract.connect(funder1).fund({ value: sendValue1 });
    await contract.connect(funder2).fund({ value: sendValue2 });

    // Get the owner's balance before calling the withdraw function
    const ownerBalanceBefore = await owner.getBalance();

    // Call the withdraw function
    const transactionResponse = await contract.connect(owner).withdraw();
    const transactionReceipt = await transactionResponse.wait(1);
    const { gasUsed, effectiveGasPrice } = transactionReceipt;
    const gasCost = gasUsed.mul(effectiveGasPrice);

    // Get the owner's balance after calling the withdraw function
    const ownerBalanceAfter = await owner.getBalance();

    // Check that the owner's balance has increased by the contract balance
    expect(ownerBalanceAfter.add(gasCost)).to.equal(
      ownerBalanceBefore.add(sendValue1.add(sendValue2))
    );
  });
});
