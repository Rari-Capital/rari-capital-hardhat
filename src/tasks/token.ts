import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

//@ts-ignore
import abi from "erc-20-abi";
import { commify, parseEther } from "ethers/lib/utils";
import { impersonateAccount } from "../utils/impersonate";
import { createERC20 } from "./turbo/utils/turboContracts";
import { BigNumber, constants } from "ethers";

const getTokenInfo = (token: string) => {
  switch (token) {
    case "USDC":
      return {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimals: 9,
        holderToImpersonate: "0x7344e478574acbe6dac9de1077430139e17eec3d",
      };
    case "DAI":
      return {
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        decimals: 18,
        holderToImpersonate: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
      };
    case "D3":
      return {
        address: "0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89",
        decimals: 18,
        holderToImpersonate: "0xc13fd05bf9aea66d5f00b7ae36d4ed2605ad0803",
      };
    case "TRIBE":
      return {
        address: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
        decimals: 18,
        holderToImpersonate: "0x3744da57184575064838bbc87a0fc791f5e39ea2",
      };
    case "BalancerBTCStablePool":
      return {
        address: "0xFeadd389a5c427952D8fdb8057D6C8ba1156cC56",
        decimals: 18,
        holderToImpersonate: "0x855723b4439a039a323650377f5d669bf0e9a0d7",
      };
    case "BAL":
      return {
        address: "0xba100000625a3754423978a60c9317c58a424e3D",
        decimals: 18,
        holderToImpersonate: "0xff052381092420b7f24cc97fded9c0c17b2cbbb9",
      };
    case "GOHM":
      return {
        address: "0x0ab87046fbb341d058f17cbc4c1133f25a20a52f",
        decimals: 18,
        holderToImpersonate: "0x6818f033693917de3a2e657f9f960e59955e06f1",
      };
    default:
      break;
  }
};

const getContract = (
  address: string,
  holderToImpersonate: string,
  provider: any,
  hre: any
) => {
  return new hre.ethers.Contract(
    address,
    abi,
    provider.getSigner(holderToImpersonate)
  );
};

task(
  "sendToken",
  "Will send amount of token to the given address. Note that amount should be within the impersonated account balance."
)
  .addParam("to", "Transfer recipient")
  .addParam("amount", "Amount of tokens to be transfered in regular numbers")
  .addParam(
    "token",
    "Symbol of the token to be transfered in caps. i.e. DAI, USDC"
  )
  .setAction(async (taskArgs, hre) => {
    const provider = new hre.ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
    const recipient = taskArgs.to;
    const amount = taskArgs.amount;
    const token = taskArgs.token;

    const tokenInfo = getTokenInfo(token);

    if (!tokenInfo) return;

    await provider.send("hardhat_impersonateAccount", [
      tokenInfo.holderToImpersonate,
    ]);

    const daiContract = getContract(
      tokenInfo.address,
      tokenInfo.holderToImpersonate,
      provider,
      hre
    );
    const balanceOfSender = await daiContract.balanceOf(
      tokenInfo.holderToImpersonate
    );
    console.log(balanceOfSender);
    console.log("hey");
    const balanceBefore = await daiContract.balanceOf(recipient);

    const parsedAmount =
      tokenInfo.decimals === 18
        ? hre.ethers.utils.parseEther(amount)
        : hre.ethers.utils.parseUnits(amount, tokenInfo.decimals);

    const transfer = await daiContract.transfer(recipient, parsedAmount);

    const balanceAfter = await daiContract.balanceOf(recipient);

    const clean = (number: any) => {
      return commify(number.div(hre.ethers.constants.WeiPerEther).toString());
    };

    console.log(
      "Your balance changed from: " +
        clean(balanceBefore) +
        " => " +
        clean(balanceAfter)
    );
  });

task("sendEther", async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();

  const transactionHash = await signers[0].sendTransaction({
    to: "0xfc083469EF154eb69FC0674cd6438530B6D92366",
    value: hre.ethers.utils.parseEther("1000"), // Sends exactly 1.0 ether
  });

  console.log({ transactionHash });
});

task("approve", "Will approve max amount of token to the spender.")
  .addParam("token", "Token to approve")
  .addParam("spender", "Address of spender")
  .setAction(async (taskArgs, hre) => {
    const erc20Contract = await createERC20(hre, taskArgs.token);
    const receipt = await erc20Contract.approve(
      taskArgs.spender,
      constants.MaxUint256
    );

    console.log(receipt);
  });

task("allowance-of", "Will check owners allowance of spender")
  .addParam("token", "Token to get allowance for")
  .addParam("spender", "Address of spender")
  .addParam("owner", "Address of the owner")
  .setAction(async (taskArgs, hre) => {
    const erc20Contract = await createERC20(hre, taskArgs.token);

    const receipt = await erc20Contract.callStatic.allowance(
      taskArgs.owner,
      taskArgs.spender
    );

    console.log(receipt);
  });

task("balance-of", "Will get balance of address for the given token.")
  .addParam("token", "Token address")
  .addParam("address", "Address to get balance for")
  .setAction(async (taskArgs, hre) => {
    const erc20Contract = await createERC20(hre, taskArgs.token);

    const balance = await erc20Contract.balanceOf(taskArgs.address);

    const clean = (number: any) => {
      return commify(number.div(hre.ethers.constants.WeiPerEther).toString());
    };

    console.log(clean(balance));
  });

task("impersonate-account", "Will impersonate given account")
  .addParam("account", "Account to impersonate")
  .setAction(async (taskArgs, hre) => {
    await impersonateAccount(hre.ethers.provider, taskArgs.account);
  });

task("mining", async (taskArgs, hre) => {
  await hre.ethers.provider.send("evm_setIntervalMining", [5000]);
  console.log("success");
});

task("stop-mining", async (taskArgs, hre) => {
  await hre.ethers.provider.send("evm_setIntervalMining", [0]);
  console.log("success");
});
