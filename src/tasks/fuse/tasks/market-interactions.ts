import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// // Fuse SDK
import { collateral } from '../../../utils/fuse/market-interactions/collateral/collateral';

// Hardhat helpers
import { configureEnv } from '../../../utils';
import { checkAllowanceAndApprove } from '../../../utils/fuse/market-interactions/utils/checkAllowanceAndApprove';
import { marketInteraction } from '../../../utils/fuse/market-interactions/market-interaction';

task('supply', 'Will supply amount of token to market.')
    .addParam('underlying', 'Address for the underlying token of the market to supply to. 0 if its ether.')
    .addParam('market', 'Address of the market/ctoken to supply to.')
    .addParam('comptroller', 'Address of comptroller where the market is listed on.')
    .addParam('amount', 'Amount of underlying to supply.')
    .addOptionalParam('collateralize', 'If true, the supplied amount will be enabled as collateral.')
    .addOptionalParam('user', 'Address of user that is supplying. Must be a hardhat address.')
    .setAction( async (taskArgs, hre) => {
        const {address} = await configureEnv(hre)

        const provider = hre.ethers.provider
        // 1. On an erc20 check for allowance and approve given market to use funds. 
        if(taskArgs.underlying !== '0') {
            await checkAllowanceAndApprove(
                address,
                taskArgs.market,
                taskArgs.underlying,
                taskArgs.amount,
                provider
            )
        }

        // 2. If true enable as collateral. i.e enter market.
        if (taskArgs.enableAsCollateral) {
            await collateral(
                taskArgs.comptrollerAddress,
                [taskArgs.marketAddress],
                "enter",
                provider
            )
        }

        // 3. Supply to given market.
        await marketInteraction(
            "supply",
            taskArgs.market,
            taskArgs.amount,
            provider,
            taskArgs.underlying,
            address,
        )
    }
)

// task('collateral', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//     await collateral(
//         "0x42053c258b5cd0b7f575e180DE4B90763cC2358b",
//         ["0xdeF5E280FCE2381ff5091Aeb13Bf7E44ca3c4Ad1"],
//         "enter",
//         fuse.provider
//     )
// })

task('withdraw', 'Withdraws amount from given market')
    .addParam('market', 'Address of market to withdraw from.')
    .addParam('amount', 'Amount to withdraw from given market.')
    .addParam('token', 'Address of token to withdraw. 0 if its Eth')
    .setAction(async (taskArgs, hre) => {
    const {fuse, fuseDeployed, address} = await configureEnv(hre)
    if (!fuseDeployed) return

    await marketInteraction(
        "withdraw",
        taskArgs.market,
        taskArgs.amount,
        fuse.provider,
        address,
        taskArgs.token,
    )
})

task('borrow', 'Borrows amount from given market')
    .addParam('market', 'Address of market to withdraw from.')
    .addParam('amount', 'Amount to withdraw from given market.')
    .addParam('token', 'Address of token to withdraw. 0 if its Eth')
    .setAction(async (taskArgs, hre) => {
    const {fuse, fuseDeployed, address} = await configureEnv(hre)
    if (!fuseDeployed) return

    await marketInteraction(
        "borrow",
        taskArgs.market,
        taskArgs.amount,
        fuse.provider,
        address,
        taskArgs.token,
    )
})

task('repay', 'Borrows amount from given market')
    .addParam('market', 'Address of market to withdraw from.')
    .addParam('amount', 'Amount to withdraw from given market.')
    .addParam('token', 'Address of token to withdraw. 0 if its Eth')
    .setAction(async (taskArgs, hre) => {
    const {fuse, fuseDeployed, address} = await configureEnv(hre)
    if (!fuseDeployed) return

    await marketInteraction(
        "repay",
        taskArgs.market,
        taskArgs.amount,
        fuse.provider,
        address,
        taskArgs.token,
    )
})