import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FlywheelABI from '../abis/FlywheelCore.json'
import FuseFlywheelABI from '../abis/FuseFlywheelCore.json'
import FuseFlywheelRewardsABI from '../abis/FuseFlywheelDynamicRewards.json'
import { task } from 'hardhat/config';
import { formatEther, getAddress } from 'ethers/lib/utils';
import { createFuseLensSecondary } from '../utils/fuseContracts';

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('lens-get-rewards-by-supplier', "Will get rewards earned by the given address as supplier of available markets.")
    .addParam('account', 'Account to get earned rewards for')
    .setAction(async (taskArgs, hre) => {
    
    const fuseLensSecondaryContract = createFuseLensSecondary(
        hre.ethers.provider,
    )


    const rewards = await fuseLensSecondaryContract.callStatic.getRewardsDistributorsBySupplier(
        taskArgs.account
    )

    console.log({rewards})
})

task('lens-get-unclaimed-rewards-by-supplier', "Will get rewards earned by the given address as supplier of available markets.")
    .addParam('account', 'Account to get earned rewards for')
    .addParam('rd', 'Reward distributor to query')
    .setAction(async (taskArgs, hre) => {
    
    const fuseLensSecondaryContract = createFuseLensSecondary(
        hre.ethers.provider,
    )


    const rewards = await fuseLensSecondaryContract.callStatic.getUnclaimedRewardsByDistributors(
        taskArgs.account,
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