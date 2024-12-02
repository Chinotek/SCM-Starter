import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import "./styles.css";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [userRoll, setUserRoll] = useState(undefined);
  const [dealerRoll, setDealerRoll] = useState(undefined);
  const [result, setResult] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceWei = await atm.getBalance();
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(balanceEth);
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(ethers.utils.parseEther("10"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      if (balance === "0.0") {
        alert("Cannot withdraw 0 balance");
        return;
      }
      let tx = await atm.withdraw(ethers.utils.parseEther(balance));
      await tx.wait();
      getBalance();
    }
  };

  const rollDice = async () => {
    if (atm) {
      try {
        await atm.checkInsufficientBalance();
      } catch (error) {
        alert("Insufficient balance to play the game");
        return;
      }

      const userRoll = Math.floor(Math.random() * 6) + 1;
      const dealerRoll = Math.floor(Math.random() * 6) + 1;
      console.log(`User Roll: ${userRoll}, Dealer Roll: ${dealerRoll}`);

      setUserRoll(userRoll);
      setDealerRoll(dealerRoll);

      let newBalance;
      let resultMessage;
      if (userRoll > dealerRoll) {
        newBalance = ethers.utils.parseEther(balance).mul(2);
        resultMessage = "You won!";
      } else if (userRoll < dealerRoll) {
        newBalance = ethers.utils.parseEther(balance).div(2);
        resultMessage = "You lost!";
      } else {
        newBalance = ethers.utils.parseEther(balance);
        resultMessage = "It's a draw!";
      }

      setResult(resultMessage);

      let tx = await atm.setNewBalance(newBalance);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return(<div className="container mx-auto p-4 text-center">
      <p>Please install Metamask to continue.</p>
      </div>);
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (<div className="container mx-auto p-4 text-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={connectAccount}>Please connect your Metamask wallet</button>
      </div>);
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl">Welcome, {account}</h2>
        <p>Let's play a game of dice!</p>
        <br />
        <p>Your Balance: {balance} ETH</p>
        <br />
        <h3>Actions</h3>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={deposit}>Deposit 10 ETH</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={withdraw}>Withdraw All</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={rollDice}>Roll Dice</button>
        {userRoll !== undefined && dealerRoll !== undefined && (
          <div>
            <br />
            <h3>Game Results:</h3>
            <br />
            <p>Your Roll: {userRoll}</p>
            <p>Dealer Roll: {dealerRoll}</p>
            <p>{result}</p>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Metacrafter's Dice Game!</h1>
      </header>
      {initUser()}
    </main>
  );
}