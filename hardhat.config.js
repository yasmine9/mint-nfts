require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require('dotenv').config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */


module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [`0x${process.env.PRIVATE_KEY}`] ,
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts:  [`0x${process.env.PRIVATE_KEY}`] ,
    },
  },
  
};

