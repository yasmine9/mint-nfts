const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
    const nftContract = await nftContractFactory.deploy(); 
    //Hardhat will create a local Ethereum network, but just for this contract. 
  //Then, after the script completes it'll destroy that local network. So, every time we run the contract, it'll be a fresh blockchain. 

    await nftContract.deployed();
    // wait until the contract is officially mined and deployed to the local blockchain! 
    //hardhat actually creates faker "miners" on the local machine to try its best to imitate the actual blockchain.
    console.log("Contract deployed to:", nftContract.address);

   
    let txn = await nftContract.makeAnEpicNFT()  // Call the function.( mint an NFT)
    await txn.wait() // Wait for it to be mined.
    
    txn = await nftContract.makeAnEpicNFT() // Mint another NFT.
    await txn.wait()

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();

  