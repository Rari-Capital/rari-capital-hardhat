// Types
import { Fuse } from '../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';
import { Contract, Signer } from 'ethers';

/**
 * @param signer - An ethers signer.
 * @param rdAddress - Rewards distributor's address.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param flywheel - Used for logging the correct success message.
 */
export async function addRdToPool(
    signer: Signer,
    rdAddress: string,
    comptrollerAddress: string,
    flywheel?: boolean
) {
    // 1. Initiate comptroller contract.
    const functionInterface = [
        'function _addRewardsDistributor(address RdAddress)'
    ]

    const comptrollerContract = new Contract(
        comptrollerAddress,
        functionInterface,
        signer
    )

    // 2. Add rd to comptroller.
    await comptrollerContract._addRewardsDistributor(rdAddress)

    const stringToShow = !flywheel ? "Rewards distributor was added to your pool" : "Flywheel was added to your pool"
    console.info(
        colors.green(
            `-- Comptroller configuration successful. ` + stringToShow
        )
    )
}