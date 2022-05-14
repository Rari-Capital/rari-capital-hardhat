import '@nomiclabs/hardhat-ethers';
import {  Contract } from 'ethers';
import FlywheelABI from '../abis/FlywheelCore.json'
import FuseFlywheelABI from '../abis/FuseFlywheelCore.json'
import FuseFlywheelRewardsABI from '../abis/FuseFlywheelDynamicRewards.json'
import { task } from 'hardhat/config';
import { formatEther, getAddress } from 'ethers/lib/utils';
import { createFlywheelLens, createFuseFlywheelCore } from '../utils/contracts';
import { filterOnlyObjectProperties } from '../../fuse/utils/fuse/misc';
import { addRdToPool } from '../../fuse/utils/fuse/pool-interactions/add-rd';

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
        taskArgs.flywheel,
        FuseFlywheelRewardsABI.abi,
        hre.ethers.provider
    )

    const rewardToken = await flywheelContract.rewardToken()
    console.log({rewardToken})
})

task('flywheel-is-rewards-distributor', "Will return true if it is")
    .addParam('flywheel', 'Flywheel attached to the market/strategy')
    .setAction(async (taskArgs, hre) => {
    
    const flywheelContract = createFuseFlywheelCore(
        hre.ethers.provider,
        taskArgs.flywheel,
    )

    const rewardToken = await flywheelContract.isRewardsDistributor()
    console.log({rewardToken})
})

task('flywheel-router-get-market-rewards-info')
    .addParam('comptroller', 'Comptroller to get info for')
    .setAction(async (taskArgs, hre) => {
        const flywheelRouterContract = createFlywheelLens(hre.ethers.provider)
        console.log("PRE")
        const rewardsInfo = await flywheelRouterContract.callStatic.getMarketRewardsInfo(taskArgs.comptroller)

        console.log({rewardsInfo})
        let cTokenPluginRewardsMap: any = {};
        let flywheelCTokensMap: any = {};
        let uniqueRewardTokens: Set<string> = new Set<string>();

        if (rewardsInfo) {
            rewardsInfo.forEach((marketRewardInfo: any) => {
                const { market, rewardsInfo } = marketRewardInfo;
                console.log({market, rewardsInfo})

                rewardsInfo.forEach((flywheelData: any) => {
                    const { flywheel, formattedAPR, rewardToken } =
                        filterOnlyObjectProperties(flywheelData);
                    console.log({flywheel, formattedAPR, rewardToken})

                    const obj = {
                        rewardToken,
                        formattedAPR: parseFloat(formattedAPR.toString()) / 1e16,
                      };

                    if (!formattedAPR.isZero()) {
                            uniqueRewardTokens.add(rewardToken);
                            // flywheelCTokensMap[flywheel] = [...flywheelCTokensMap[flywheel], market]
                            cTokenPluginRewardsMap[market] = {
                                ...cTokenPluginRewardsMap[market],
                                [flywheel]: obj,
                        };
                    }
                })
            })
        }
        const rewardTokens = Array.from(uniqueRewardTokens);

        const _result: any = {
            incentives: cTokenPluginRewardsMap,
            hasIncentives: !!rewardTokens.length,
            rewardTokens,
            rewardsDistributorCtokens: flywheelCTokensMap,
        };

        console.log({_result, incentives: _result.incentives})

    })
