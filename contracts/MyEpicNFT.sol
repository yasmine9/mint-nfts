pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol"; // will help us encode in base64


contract MyEpicNFT is ERC721URIStorage {
  // Counters is given by OpenZeppelin to help keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

// our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
  // So, we make a baseSvg variable here that all our NFTs can use.
  // We split the SVG at the part where it asks for the background color.
  string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
  string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  
  // Random words array
  string[] firstWords = ["Professor", "Hair", "Shopping", "Requirement", "Tension", "Marriage"];
  string[] secondWords = ["Member", "Preparation", "History", "Exam", "Chocolate", "Injury"];
  string[] thirdWords = ["Strategy", "Definition", "Memory", "University", "Fact", "Competition"];
// array of colors 
  string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

// counter of NFT minted by each user 
mapping (address => uint256)  AdrToCounter;
uint MintingLimit = 10; 

event NewEpicNFTMinted(address sender, uint256 tokenId); // will be used to get the tokenId from the frontend when an NFT is minted.

// randomly pick a word from each array.
  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    // Squash the # between 0 and the length of the array to avoid going out of bounds.
    rand = rand % firstWords.length;
    return firstWords[rand];
  }

  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  function pickRandomColor(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
    rand = rand % colors.length;
    return colors[rand];
  }

  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }


  // We need to pass the name of our NFTs token and it's symbol.
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }
  //return number of NFTs minted by a user 
  function getTotalNFTsMintedSoFar() public view returns(uint256){
      return (AdrToCounter[msg.sender]);
  }

  // A function our user will hit to get their NFT.
  function makeAnEpicNFT() public {
      require(AdrToCounter[msg.sender]<MintingLimit);
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();

// Randomly grab one word from each of the three arrays. and a random color
    string memory randomColor = pickRandomColor(newItemId);
    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));


    // Get all the JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    combinedWord,
                    '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );

    // we prepend data:application/json;base64, to our data.
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log(
    string(
        abi.encodePacked(
            "https://nftpreview.0xdev.codes/?code=",
            finalTokenUri
        )
    ));
    console.log("--------------------\n");  


     // mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);

    // Set the NFTs data.
    _setTokenURI(newItemId, finalTokenUri);  //setting the actual data that makes the NFT valuable!!!
     console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
    AdrToCounter[msg.sender]++;
    emit NewEpicNFTMinted(msg.sender, newItemId);

  }
}