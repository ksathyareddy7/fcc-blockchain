import { contractAddress, abi } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";

// BUTTONS
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

//EVENT LISTENERS
connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
  if (typeof window.ethereum !== undefined) {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    document.getElementById("connectButton").innerText = "connected";
  } else {
    document.getElementById("connectButton").innerText = "install metamask";
  }
}

async function fund() {
  const ethAmount = "0.1";
  if (window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
  }
}
