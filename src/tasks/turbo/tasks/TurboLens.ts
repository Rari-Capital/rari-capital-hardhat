import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Ethers
import { BigNumber } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callInterfaceWithMulticall, callStaticWithMultiCall, encodeCall } from '../../../utils/multicall';
import { createTurboLens, ITurboLens } from '../utils/turboContracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { TurboAddresses } from '../utils/constants';
import { encode } from 'querystring';

/** Types **/
type SafeInfo = {
    collateralAsset: string;
    collateralAmount: BigNumber;
    collateralValue: BigNumber;
    debtAmount: BigNumber;
    debtValue: BigNumber;
    boostedAmount: BigNumber;
    feiAmount: BigNumber;
    tribeDAOFee: BigNumber;
}

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('turbo-get-all-user-safes', "Will get all available safes created by the given user")
.addParam('id', 'chainID')
    .addParam('user', 'User to filter for')
    .setAction(async (taskArgs, hre) => {
    
   const userSafes = await getAllUserSafes(hre, taskArgs.user, taskArgs.id)

   console.log(userSafes)
})


task('turbo-get-lens-master', "Will get TurboLens address")
    .addParam('id', 'chainID')
    .setAction(async (taskArgs, hre) => {
    
    let lens = await createTurboLens(hre, taskArgs.id)

    const master = await lens.master()

    console.log({master})
})

task('turbo-get-safe-info', "Will get all info for the given safe")
    .addParam('id', 'chainID')
    .addParam('safe', 'User to filter for')
    .setAction(async (taskArgs, hre) => {
    const info = await getSafeInfo(hre, taskArgs.safe, taskArgs.id)
    console.log({info})
})

/** Funcs **/
export const getSafeInfo = async (hre: HardhatRuntimeEnvironment, safe: string, id: number) => {
    let lens = await createTurboLens(hre, id)
    try {
        const result: SafeInfo = await lens.callStatic.getSafeInfo(safe)
        return result
    } catch (err) {
        console.log(err)
    }
}

export const getAllUserSafes = async (hre: HardhatRuntimeEnvironment, user: string, id: number) => {
    const turboLens = await createTurboLens(hre, id)
    return await turboLens.callStatic.getAllUserSafes(user)
}


export const getSafesInfo = async (provider: JsonRpcProvider, safes: string[], id: number) => {

    let encodedCalls = safes.map(safe => {
        return encodeCall(ITurboLens, TurboAddresses[id].LENS, "getSafeInfo", [safe])
    })


    try {
        const safeInfos = await callStaticWithMultiCall(provider, encodedCalls)
        console.log({ safeInfos })
        return safeInfos
    } catch (err) {
        console.log(err)
    }
}