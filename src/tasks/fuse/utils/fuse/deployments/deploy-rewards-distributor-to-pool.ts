// Types
import { Fuse } from '../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';

// Function
import { addRdToPool } from '../pool-interactions/add-rd';
import { Signer } from 'ethers';

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment passed from task.
 * @param underlying - Address of token to distribute. i.e for DAI 0x6b175474e89094c44da98b954eedeac495271d0f.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 * @param address - Optional. If present it'll be used as the address that deploys the reward distributor. 
 */
export async function deployRdToPool(
    fuse: Fuse,
    signer: Signer,
    underlying: string,
    comptrollerAddress: string,
    comptrollerAdmin: string,
    address?: string
) {
    // 1. Deploy Rd
    const deployedDistributor = await fuse.deployRewardsDistributor(
        underlying,
        {
          from: address ?? comptrollerAdmin,
        }
    );

    // // 2. Add to pool
    await addRdToPool(
        signer,
        deployedDistributor.address,
        comptrollerAddress,
    )

    return deployedDistributor.address
}