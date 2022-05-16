import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FuseFlywheelABI from '../../abis/FuseFlywheelCore.json'
import { task } from 'hardhat/config';
import { getAddress } from 'ethers/lib/utils';
import { createFuseFlywheelCore } from '../../utils/contracts';

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-add-market', "Will add market to given flywheel")
    .addParam('market', 'Market to add')
    .addParam('flywheel', 'Flywheel to add market to')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FuseFlywheelABI.abi,
        signer
    )

    const receipt = await flywheelContract.addMarketForRewards(getAddress(taskArgs.market))

    console.log({receipt})
})

task('increase-time', "Will accelerate UNIX timestamp. Useful to simulate cycle completion for DynamicRewards module on a flywheel.")
    .addParam('seconds', "Seconds to increase current UNIX timestamp with, in milliseconds")
    .setAction(async (taskArgs, hre) => {
    const blockNumBefore = await hre.ethers.provider.getBlockNumber();
    const blockBefore = await hre.ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    
    console.log()
    hre.ethers.provider.send(
        "evm_mine",
        [blockBefore.timestamp + parseFloat(taskArgs.seconds)]
    )

    const blockNumAfter = await hre.ethers.provider.getBlockNumber();
    const blockAfter = await hre.ethers.provider.getBlock(blockNumAfter);
    const timestampAfter = blockAfter.timestamp;


    console.log({timestampBefore, timestampAfter})
})


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-is-rewards-distributor', "Will return true if it is")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = createFuseFlywheelCore(
        hre.ethers.provider,
        taskArgs.flywheel,
    )

    const rewardsAccrued = await flywheelContract.isRewardsDistributor()
    console.log({rewardsAccrued})
})

task('flywheel-rewards-accrued', "Will return accrued rewards for user")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .addParam('user', 'User address')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = createFuseFlywheelCore(
        hre.ethers.provider,
        taskArgs.flywheel,
    )

    const rewardToken = await flywheelContract.rewardsAccrued(taskArgs.user)
    console.log({rewardToken})
})