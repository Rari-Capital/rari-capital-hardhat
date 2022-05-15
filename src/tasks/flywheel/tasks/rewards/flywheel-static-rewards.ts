import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FuseFlywheelStaticRewardsABI from '../../abis/FlywheelStaticRewards.json'
import { task } from 'hardhat/config';
import { getAddress } from 'ethers/lib/utils';

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('flywheel-rewards-strategy-info', "Get rewards infotmation (speed, end timestamp) for a given strategy.")
    .addParam('strategy', 'Strategy to set rewards stream for')
    .addParam('rewards', 'Rewards module contract address, has to be static')
    .setAction(async (taskArgs, hre) => {
    const flywheelContract = new Contract(
        taskArgs.flywheel,
        FuseFlywheelStaticRewardsABI.abi,
        hre.ethers.provider
    )

    const receipt = await flywheelContract.rewardsInfo(getAddress(taskArgs.strategy))

    console.log({receipt})
})