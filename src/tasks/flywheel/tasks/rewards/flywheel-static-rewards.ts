import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FuseFlywheelABI from '../../abis/FuseFlywheelCore.json'
import FuseFlywheelRewardsABI from '../../abis/FuseFlywheelDynamicRewards.json'
import { task } from 'hardhat/config';
import { getAddress } from 'ethers/lib/utils';

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-set-rewards-info', "Set rewards per second and rewards end time for reward stream")
    .addParam('strategy', 'Strategy to set rewards stream for')
    .addParam('amount', 'Rewards per second')
    .addParam('end', 'Rewards stream end cycle')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FuseFlywheelABI.abi,
        signer
    )

    const receipt = await flywheelContract.setRewardsInfo(getAddress(taskArgs.market))

    console.log({receipt})
})

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('rewards-next-cycle', "Will get aproximation of earned rewards on next cycle.")
    .addParam('strategy', "Strategy to get earned rewards from")
    .addParam('rewards', "Rewards module address")
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelRewardsABI.abi,
        hre.ethers.provider
    )

    const rewardsCycleLength = await flywheelContract.getNextCycleRewards(taskArgs.strategy)
    console.log({rewardsCycleLength})
})

task('rewards-cycle-length', "Will get cycle lenght of the given flywheel.")
    .addParam('rewards', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelRewardsABI.abi,
        hre.ethers.provider
    )

    const rewardsCycleLength = await flywheelContract.rewardsCycleLength()
    console.log({rewardsCycleLength})
})