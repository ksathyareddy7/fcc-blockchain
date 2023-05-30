const { network } = require("hardhat");
const {
  networkConfig,
  DEVELOPMENT_CHAINS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeed;
  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeed = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
  }

  const args = [ethUsdPriceFeed];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
  });
  if (
    !DEVELOPMENT_CHAINS.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("---------------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
