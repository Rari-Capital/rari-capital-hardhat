import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FuseFlywheelStaticRewardsABI from '../../abis/FlywheelStaticRewards.json'
import { task } from 'hardhat/config';
import { getAddress } from 'ethers/lib/utils';

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-rewards-set-strategy-info', "Get rewards infotmation (speed, end timestamp) for a given strategy.")
    .addParam('strategy', 'Strategy to set rewards stream for')
    .addParam('speed', 'Speed of reward distribution per second')
    .addParam('end', 'Timestamp where rewards will stop')
    .addParam('rewards', 'Rewards module contract address, has to be static')
    .setAction(async (taskArgs, hre) => {
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelStaticRewardsABI.abi,
        hre.ethers.provider.getSigner()
    )

    const receipt = await flywheelContract.setRewardsInfo(getAddress(taskArgs.strategy), [taskArgs.speed, taskArgs.end])

    console.log({receipt})
})

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-rewards-strategy-info', "Get rewards infotmation (speed, end timestamp) for a given strategy.")
    .addParam('strategy', 'Strategy to set rewards stream for')
    .addParam('rewards', 'Rewards module contract address, has to be static')
    .setAction(async (taskArgs, hre) => {
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelStaticRewardsABI.abi,
        hre.ethers.provider
    )

    const receipt = await flywheelContract.rewardsInfo(getAddress(taskArgs.strategy))

    console.log({receipt})
})