import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FuseFlywheelDynamicRewardsABI from '../../abis/FuseFlywheelDynamicRewards.json'
import { task } from 'hardhat/config';

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-rewards-next-cycle', "Will get aproximation of earned rewards on next cycle.")
    .addParam('strategy', "Strategy to get earned rewards from")
    .addParam('rewards', "Rewards module address")
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelDynamicRewardsABI.abi,
        hre.ethers.provider
    )

    const rewardsCycleLength = await flywheelContract.getNextCycleRewards(taskArgs.strategy)
    console.log({rewardsCycleLength})
})

task('flywheel-rewards-cycle-length', "Will get cycle lenght of the given flywheel.")
    .addParam('rewards', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelDynamicRewardsABI.abi,
        hre.ethers.provider
    )

    const rewardsCycleLength = await flywheelContract.rewardsCycleLength()
    console.log({rewardsCycleLength})
})