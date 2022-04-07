import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FlywheelABI from '../abis/FlywheelCore.json'
import FuseFlywheelABI from '../abis/FuseFlywheelCore.json'
import FuseFlywheelRewardsABI from '../abis/FuseFlywheelDynamicRewards.json'
import { task } from 'hardhat/config';
import { formatEther, getAddress, parseEther } from 'ethers/lib/utils';

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-accrue', "Will accrue given flywheel on given market for the given address")
    .addParam('market', 'Market to accrue from')
    .addParam('address', 'User to accrue for')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        signer
    )

    const receipt = await flywheelContract['accrue(address,address)'](getAddress(taskArgs.market), getAddress(taskArgs.address))

    console.log({receipt})
})

task('flywheel-set-owner', "Will set owner of the given flywheel")
    .addParam('owner', 'Address of the new owner')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
        await hre.ethers.provider.send(
            "hardhat_impersonateAccount",
            ['0xB290f2F3FAd4E540D0550985951Cdad2711ac34A'],
            );

    const signer = await hre.ethers.getSigner('0xB290f2F3FAd4E540D0550985951Cdad2711ac34A')
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        signer
    )
    const receipt = await flywheelContract.setOwner(getAddress(taskArgs.owner))

    console.log({receipt})
})


task('flywheel-claim', "Will claim rewards on given flywheel for the given address")
    .addParam('address', 'Address to accrue rewards for')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        signer
    )

    const receipt = await flywheelContract.claimRewards(taskArgs.address)

    console.log({receipt})
})

task('flywheel-set-rewards-module', "Will set rewards module to the given address.")
    .addParam('rewards', 'Address of the new rewards module')
    .addParam('flywheel', 'Flywheel to set rewards module for')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        signer
    )

    const receipt = await flywheelContract.setFlywheelRewards(getAddress(taskArgs.rewards))

    console.log({receipt})
})

task('flyewheel-add-market', "Will add market to given flywheel")
    .addParam('market', 'Market to add')
    .addParam('flywheel', 'Flywheel to add market to')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FuseFlywheelABI.abi,
        signer
    )

    console.log('hello  ')

    const receipt = await flywheelContract.addMarketForRewards(getAddress(taskArgs.market))

    console.log({receipt})

})

task('increase-time', "Will accelerate UNIX timestamp. Useful to simulate cycle completion for DynamicRewards module on a flywheel.")
    .addParam('seconds', "Seconds to increase current UNIX timestamp with")
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
task('flywheel-accrued', "Will return accrued rewards for the given user")
    .addParam('user', 'User to accrue for')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        signer
    )

    const accrued = await flywheelContract.rewardsAccrued(taskArgs.user)
    console.log({accrued: formatEther(accrued)})
})

task('flywheel-strategy-state', "Will get the strategy's state on the given flywheels.")
    .addParam('strategy', 'Strategy to get state for')
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        signer
    )

    console.log(flywheelContract)

    const receipt = await flywheelContract.strategyState(taskArgs.strategy)
    console.log({receipt})
})

task('flywheel-get-owner', "Will get owner of the given flywheel.")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        hre.ethers.provider
    )

    const owner = await flywheelContract.owner()
    console.log({owner})
})

task('flywheel-get-rewards-module', "Will get address of rewards module of the given flywheel.")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FlywheelABI.abi,
        hre.ethers.provider
    )

    const flywheelRewards = await flywheelContract.flywheelRewards()
    console.log({flywheelRewards})
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

task('flywheel-rewarded-token', "Will get rewarded token by the given flywheel.")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = new Contract(
        taskArgs.rewards,
        FuseFlywheelRewardsABI.abi,
        hre.ethers.provider
    )

    const rewardToken = await flywheelContract.rewardToken()
    console.log({rewardToken})
})
