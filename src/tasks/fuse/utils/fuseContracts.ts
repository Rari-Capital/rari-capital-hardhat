import { BaseProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import ComptrollerABI from "../../turbo/abis/Comptroller/comptroller.json";
import CTokenABI from "../../../../artifacts/contracts/external/compound/CToken.sol/CToken.json"
import RewardsDistributorABI from "../../../../artifacts/contracts/external/compound/RewardsDistributor.sol/RewardsDistributor.json"
import FuseLensSecondary from '../../../../artifacts/contracts/FusePoolLensSecondary.sol/FusePoolLensSecondary.json'

export const createComptroller = (
    provider: BaseProvider,
    comptrollerAddress: string
  ) => {
    const turboRouterContract = new Contract(
      comptrollerAddress,
      ComptrollerABI,
      provider
    );
  
    return turboRouterContract;
  };


  export const createCToken = (
    provider: BaseProvider,
    comptrollerAddress: string
  ) => {
    const turboRouterContract = new Contract(
      comptrollerAddress,
      CTokenABI.abi,
      provider
    );
  
    return turboRouterContract;
  };

  export const createRD = (
    provider: BaseProvider,
    rdAddress: string
  ) => {
    return new Contract(
      rdAddress,
      RewardsDistributorABI,
      provider
    )
  }

  export const createFuseLensSecondary = (
    provider: BaseProvider,
  ) => {
    return new Contract(
      "0xc76190E04012f26A364228Cfc41690429C44165d",
      FuseLensSecondary.abi,
      provider
    )
  }