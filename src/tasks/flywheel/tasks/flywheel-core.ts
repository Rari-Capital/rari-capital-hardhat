import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FlywheelABI from '../abis/FlywheelCore.json'
import { task } from 'hardhat/config';
import {  formatEther, getAddress } from 'ethers/lib/utils';
import { createFlywheelCore } from '../utils/contracts';


/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-accrue', "Will accrue given flywheel on given market for the given address")
    .addParam('market', 'Market to accrue from')
    .addParam('address', 'User to accrue for')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = hre.ethers.provider.getSigner()
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)

    const receipt = await flywheelContract['accrue(address,address)'](getAddress(taskArgs.market), getAddress(taskArgs.address))

    console.log({receipt})
})

task('flywheel-set-owner', "Will set owner of the given flywheel")
    .addParam('owner', 'Address of the new owner')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = hre.ethers.provider.getSigner()
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)
    const receipt = await flywheelContract.setOwner(getAddress(taskArgs.owner))

    console.log({receipt})
})

task('flywheel-claim', "Will claim rewards on given flywheel for the given address")
    .addParam('address', 'Address to accrue rewards for')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)

    const receipt = await flywheelContract.claimRewards(taskArgs.address)

    console.log({receipt})
})

task('flywheel-set-rewards-module', "Will set rewards module to the given address.")
    .addParam('rewards', 'Address of the new rewards module')
    .addParam('flywheel', 'Flywheel to set rewards module for')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)

    const receipt = await flywheelContract.setFlywheelRewards(getAddress(taskArgs.rewards))

    console.log({receipt})
})

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-accrued', "Will return accrued rewards for the given user")
    .addParam('user', 'User to accrue for')
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)

    const accrued = await flywheelContract.rewardsAccrued(taskArgs.user)
    console.log({accrued: formatEther(accrued)})
})

task('flywheel-get-all-strategies', "Will return accrued rewards for the given user")
    .addParam('flywheel', 'Flywheel attached to the market')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)

    console.log({flywheelContract})

    const strategies = await flywheelContract.callStatic.getAllStrategies()
    console.log(strategies)
})

task('flywheel-strategy-state', "Will get the strategy's state on the given flywheels.")
    .addParam('strategy', 'Strategy to get state for')
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    
    const flywheelContract = (createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)).connect(signer)

    console.log(flywheelContract)

    const receipt = await flywheelContract.strategyState(taskArgs.strategy)
    console.log({receipt})
})

task('flywheel-get-owner', "Will get owner of the given flywheel.")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)

    const owner = await flywheelContract.owner()
    console.log({owner})
})

task('flywheel-get-rewards-module', "Will get address of rewards module of the given flywheel.")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = createFlywheelCore(hre.ethers.provider, taskArgs.flywheel)

    const flywheelRewards = await flywheelContract.flywheelRewards()
    console.log({flywheelRewards})
})