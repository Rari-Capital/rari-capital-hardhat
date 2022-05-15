import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { createFlywheelLens } from '../utils/contracts';
import { filterOnlyObjectProperties } from '../../fuse/utils/fuse/misc';

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