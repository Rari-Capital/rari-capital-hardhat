import { BaseProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import FlywheelRouterABI from '../abis/FlywheelRouter.json'
import FuseFlywheelCore from '../abis/FuseFlywheelCore.json'


export const createFlywheelLens = (
    provider: BaseProvider
) => {
    return new Contract(
        "0xcd9704f874d69f0cb2ddfd04ff8e5c88f3caf02e",
        FlywheelRouterABI,
        provider
    )
}

export const createFuseFlywheelCore = (
    provider: BaseProvider,
    flywheelAddress: string
) => {
    return new Contract(
        flywheelAddress,
        FuseFlywheelCore.abi,
        provider
    )
}