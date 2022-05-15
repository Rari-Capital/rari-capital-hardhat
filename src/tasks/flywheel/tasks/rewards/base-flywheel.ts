import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import  BaseFlywheelRewards from '../../abis/BaseFlywheelRewards.json'
import { task } from 'hardhat/config';
import { getAddress } from 'ethers/lib/utils';

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-rewards-core', "Will return the rewards module core flywheel")
    .addParam('rewards', 'Rewards module address')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    const flywheelContract = new Contract(
        taskArgs.rewards,
        BaseFlywheelRewards.abi,
        signer
    )

    const receipt = await flywheelContract.flywheel()

    console.log({receipt})
})

task('flywheel-rewarded-token', "Will get rewarded token by the given flywheel rewards module.")
    .addParam('rewards', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        BaseFlywheelRewards.abi,
        hre.ethers.provider
    )

    const rewardToken = await flywheelContract.rewardToken()
    console.log({rewardToken})
})