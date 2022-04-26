import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

//@ts-ignore
import abi from 'erc-20-abi';
import { commify, formatEther, Interface, parseEther, parseUnits } from 'ethers/lib/utils';
import { impersonateAccount } from '../utils/impersonate';
import { createERC20 } from './turbo/utils/turboContracts';
import { BigNumber, BigNumberish, constants, Contract } from 'ethers';
import { signERC2612Permit } from 'eth-permit';

const getTokenInfo = (token: string) => {
    switch (token) {
      case "USDC":
        return {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 
          decimals: 9, 
          holderToImpersonate: "0x7344e478574acbe6dac9de1077430139e17eec3d" 
        }
      case "DAI":
        return {
          address: "0x6b175474e89094c44da98b954eedeac495271d0f", 
          decimals: 18,
          holderToImpersonate: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"
        }
      case "D3":
        return {
          address: "0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89",
          decimals:18,
          holderToImpersonate: "0xc13fd05bf9aea66d5f00b7ae36d4ed2605ad0803"
        }
      case "TRIBE":
        return {
          address: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
          decimals: 18,
          holderToImpersonate: "0x3744da57184575064838bbc87a0fc791f5e39ea2"
        }
      case "BalancerBTCStablePool":
        return {
          address: "0xFeadd389a5c427952D8fdb8057D6C8ba1156cC56",
          decimals: 18,
          holderToImpersonate: "0x855723b4439a039a323650377f5d669bf0e9a0d7"
        }
      case "BAL": 
        return {
          address: "0xba100000625a3754423978a60c9317c58a424e3D",
          decimals: 18,
          holderToImpersonate: "0xff052381092420b7f24cc97fded9c0c17b2cbbb9"
        }
      case "WIZARD": 
        return {
          address: "0x87931E7AD81914e7898d07c68F145fC0A553D8Fb",
          decimals: 18,
          holderToImpersonate: "0x4D04EB67A2D1e01c71FAd0366E0C200207A75487"
        }
      default:
        break;
    }
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

task("sendEther")
  .addParam("to", "Account to send ether to")
  .setAction(async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();

  const transactionHash = await signers[0].sendTransaction({
    to: taskArgs.to,
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

task('is-token-2612-compliant', 'Will return a boolean indicating if given token is compliant')
  .addParam('token', 'Token contract address')
  .setAction(async (taskArgs, hre) => {
    const interfaceTypeHash = new Interface([
      "function PERMIT_TYPEHASH() view returns (bytes32)",
      "function nonces(address) view returns (uint)"
    ])

    const tokenContract = new Contract(
      taskArgs.token,
      interfaceTypeHash,
      hre.ethers.provider
    )

    let permitTypeHash
    try {
      permitTypeHash = await tokenContract.PERMIT_TYPEHASH() 
      
    } catch {
      permitTypeHash = null
    }

    const nonces = await tokenContract.nonces("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

    console.log({permitTypeHash, nonces})
})

task("deploy-s").setAction(async (taskArgs, hre) => {
  const deployed = await (await hre.ethers.getContractFactory("Tribe")).deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

  console.log({deployed})
})

task("token-permit", '').setAction(async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners()
  const interfaceTypeHash = new Interface([
    "function PERMIT_TYPEHASH() view returns (bytes32)",
    "function nonces(address) view returns (uint)",
    "function permit(address, address, uint256, uint256, uint8, bytes32, bytes32)"
  ])
  const tokenContract = new Contract(
    "0x045857bdeae7c1c7252d611eb24eb55564198b4c",
    interfaceTypeHash,
    signers[1]
  )

  const nonce = (await tokenContract.nonces(signers[0].address)).toHexString()

  const transactionDeadline = Date.now() + 20 * 60;

  const result = await signERC2612Permit(
    hre.ethers.provider,
    "0x045857bdeae7c1c7252d611eb24eb55564198b4c",
    signers[0].address,
    signers[1].address,
    parseUnits("1000").toString(),
  )

  console.log({result})

  const receipt = await tokenContract.permit(
    signers[0].address,
    signers[1].address,
    parseUnits("1000"),
    result.deadline,
    result.v,
    result.r,
    result.s
  )

  console.log({receipt})
})

task("idk", async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners()

  const domainSeparatorEncoded = hre.ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32","uint256", "address"],
    [
      hre.ethers.utils.solidityKeccak256(["string"],["EIP712Domain(string name,uint256 chainId,address verifyingContract)"]),
      hre.ethers.utils.solidityKeccak256(["string"],["Tribe"]),
      1,
      "0xad523115cd35a8d4e60b3c0953e0e0x045857BDEAE7C1c7252d611eB24eB55564198b4Cac10418309"
    ],
  )
  
  const hashedDomainSeparator = hre.ethers.utils.solidityKeccak256(["bytes"],[domainSeparatorEncoded])

  const result = await signERC2612Permit(
    hre.ethers.provider,
    "0x045857BDEAE7C1c7252d611eB24eB55564198b4C",
    signers[0].address,
    signers[1].address,
    parseUnits("1000").toString()
  )

  const structHash = hre.ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
    [
      hre.ethers.utils.solidityKeccak256(["string"],["Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"]),
      signers[0].address,
      signers[1].address,
      parseUnits("1000"),
      0,
      result.deadline
    ]
  )

  const hashedStructHash = hre.ethers.utils.solidityKeccak256(["bytes"],[structHash])

  const digest = hre.ethers.utils.solidityPack(["string", "bytes32", "bytes32"],["\x19\x01", hashedDomainSeparator, hashedStructHash])
  const hashedDigest = hre.ethers.utils.solidityKeccak256(["bytes"],[digest])
  console.log({hashedDigest})

})

task('mining', async (taskArgs, hre) => {
  await hre.ethers.provider.send("evm_setIntervalMining", [5000]);
  console.log("success");
});

task("stop-mining", async (taskArgs, hre) => {
  await hre.ethers.provider.send("evm_setIntervalMining", [0]);
  console.log("success");
});
