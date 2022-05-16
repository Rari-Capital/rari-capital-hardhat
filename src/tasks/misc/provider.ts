import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

//@ts-ignore
import abi from 'erc-20-abi';
import { commify, formatEther, Interface, parseEther, parseUnits } from 'ethers/lib/utils';

task("get-timestamp", "Will get balance of address for the given token.")
  .setAction(async (taskArgs, hre) => {
      console.log({timestamp: (await hre.ethers.provider.getBlock(hre.ethers.provider.blockNumber)).timestamp})
  });