import '@nomiclabs/hardhat-ethers';
import {  Contract, ContractFactory } from 'ethers';
import  BaseFlywheelRewards from '../../abis/BaseFlywheelRewards.json'
import { task } from 'hardhat/config';
import FuseFlywheelStatic from '../../abis/FlywheelStaticRewards.json'
import FuseFlywheelDynamic from '../../abis/FuseFlywheelDynamicRewards.json'

const versions: any = {
    static: FuseFlywheelStatic,
    dynamic: FuseFlywheelDynamic
}

/*///////////////////////////////////////////////////////////////
                        DEPLOYMENT
//////////////////////////////////////////////////////////////*/
task('flywheel-rewards-deploy', "Will deploy a new rewards module contract.")
    .addParam('ver', 'Rewards module version. ie static, dynamic.')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    const flywheelContract = new ContractFactory(
        versions[taskArgs.ver].abi,
        versions[taskArgs.ver].bytecode,
        signer
    )

    const receipt = await flywheelContract.deploy()

    console.log({receipt})
})

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
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