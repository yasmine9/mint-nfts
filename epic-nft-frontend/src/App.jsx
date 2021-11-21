import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/MyEpicNFT.json';
import ClipLoader from "react-spinners/ClipLoader";

// Constants
const TWITTER_HANDLE = 'yasmine42358319';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
  const CONTRACT_ADDRESS = "0xB75Aa987637faE90b071BC0aa6853E24818dfCe1";
const App = () => {

    /*
    * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
    */
    const [currentAccount, setCurrentAccount] = useState("");
    const [numberOFNFTs, setnumberOFNFTs] = useState("");
    const [loading, setLoading] = useState(false);
    /*
    * Gotta make sure this is async.
    */
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
    /*
    * First make sure we have access to window.ethereum
    */
      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      /*
      * User can have multiple authorized accounts, we grab the first one if its there!
      */
      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
          // Setup listener! This is for the case where a user comes to the site and ALREADY had their wallet connected + authorized.
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
	        alert("You are not connected to the Rinkeby Test Network!");
}
  }

const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      getTotalNFTsMintedSoFar();
        // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }



  // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);


        // Here we "capture" our event when our contract throws it.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          getTotalNFTsMintedSoFar();
          setLoading(false);
        
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


const askContractToMintNft = async () => { 

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setLoading(true);
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

const getTotalNFTsMintedSoFar = async () => {
 try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let numberOFNFTs = await connectedContract.getTotalNFTsMintedSoFar();
        console.log('returnedvalue is');
        console.log(parseInt(numberOFNFTs, 10));
        setnumberOFNFTs(parseInt(numberOFNFTs, 10));
        console.log('numberOFNFTs recuperated');

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

}
  // Render Methods
  const renderNotConnectedContainer = () => (
         <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
    getTotalNFTsMintedSoFar();
  }, [])

  const renderMintUI = () => (
<div >

    <p className="mint-count">
            You have minted {numberOFNFTs}/ {10}!! 🔥🔥 </p>
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      🤩🤩 Mint NFT 🤩🤩
    </button>
    </div>
  )

  return (
    
     <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Yas's NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <ClipLoader color ="#FFFFFF" loading={loading} size={150} />
    {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
    
        </div>
        <div >
          <button onClick={()=> window.open("https://testnets.opensea.io/collection/squarenft-vdufj9umuf", "_blank")}className="cta-button connect-wallet-button">
     🌊 View the full collection on OpenSea
    </button>
    </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;