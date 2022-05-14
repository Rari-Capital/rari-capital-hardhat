// Types
import { Fuse } from '../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';

import FuseFlywheel from '../../../abis/FuseFlywheelCore.json'

import { ContractFactory, Signer } from 'ethers';
import { addRdToPool } from '../pool-interactions/add-rd';

/**
 * @param signer - An ethers signer.
 * @param rewardedToken - The token to be rewarded by this flywheel.
 * @param rewardsModule - Rewards module address.
 * @param boosterModule - Booster module address.
 * @param flywheelOwner - Who the flywheel owner will be.
 * @param authorityModule - Authority module address. Will determine roles that can execute certain functions. See https://github.com/fei-protocol/flywheel-v2/blob/main/src/FlywheelCore.sol#L142
 * @param configureComptroller - If true, deployed flywheel will be added to the comptroller.
 * @param comptrollerAddress - Optional. Comptroller address to add the flywheel to.
 * @returns 
 */
export async function deployFlywheelToPool(
    signer: Signer,
    rewardedToken: string,
    rewardsModule: string,
    boosterModule: string,
    flywheelOwner: string,
    authorityModule: string,
    configureComptroller: boolean,
    comptrollerAddress?: string,
) {
    // 1. Deploy Rd
    const deployedFlywheel = await (new ContractFactory(
        FuseFlywheel.abi,
        FuseFlywheel.bytecode.object,
        signer
    )).deploy(
        rewardedToken, 
        rewardsModule,
        boosterModule,
        flywheelOwner,
        authorityModule
    )
    
    // 2. Add to pool if requested.
    if (configureComptroller && comptrollerAddress) {
        await addRdToPool(
            signer,
            deployedFlywheel.address,
            comptrollerAddress,
            true
        )
    }

    return deployedFlywheel.address
}