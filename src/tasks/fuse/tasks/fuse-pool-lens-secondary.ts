import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { formatEther } from 'ethers/lib/utils';
import { createFuseLensSecondary } from '../utils/fuseContracts';

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('lens-get-rewards-by-supplier', "Will get rewards earned by the given address as supplier of available markets.")
    .addParam('address', 'Account to get earned rewards for')
    .setAction(async (taskArgs, hre) => {
    
    const fuseLensSecondaryContract = createFuseLensSecondary(
        hre.ethers.provider,
    )


    const rewards = await fuseLensSecondaryContract.callStatic.getRewardsDistributorsBySupplier(
        taskArgs.address
    )

    console.log({rewards})
})

task('lens-get-unclaimed-rewards-by-supplier', "Will get rewards earned by the given address as supplier of available markets.")
    .addParam('address', 'Account to get earned rewards for')
    .addParam('rd', 'Reward distributor to query')
    .setAction(async (taskArgs, hre) => {
    
    const fuseLensSecondaryContract = createFuseLensSecondary(
        hre.ethers.provider,
    )


    const rewards = await fuseLensSecondaryContract.callStatic.getUnclaimedRewardsByDistributors(
        taskArgs.address,
        [taskArgs.rd]
    )

    let marketRewards: any = {}
    for (const market in rewards[2][0]) {
        marketRewards[rewards[2][0][market]] = [formatEther(rewards[3][0][market][0]), formatEther(rewards[3][0][market][1])]
    }


    console.log({
        rewardedToken: rewards[0],
        totalUnclaimed: formatEther(rewards[1][0]),
        marketRewards,
        totalAvailable: formatEther(rewards[4][0])
    })
})