import '@nomiclabs/hardhat-ethers';
import { ContractFactory } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { impersonateAccount } from '../../../utils/impersonate';
import { TurboAddresses } from '../utils/constants';
import { createFuseVaultFactory, createTurboBooster } from '../utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-boostable-vaults', "Will get all boostable vaults")
    .addParam('id', "ChainID")
    .setAction(async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboBooster(hre, taskArgs.id)

    const boostableVaults = await turboBoosterContract.getBoostableVaults()

    console.log({boostableVaults})
})

task('get-is-frozen', "Will return true if boosting for all safes under master is frozen.")
    .addParam('id', "ChainID")
    .setAction(async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboBooster(hre, taskArgs.id)

    const boostableVaults = await turboBoosterContract.frozen()

    console.log({boostableVaults})
})

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('whitelist-strategy', "Will deploy a Fuse4626 vault and list it in the TurboBooster")
    .addParam('ctoken', 'CToken address that the FuseERC4626 will wrap')
    .addParam('name', 'Name of the vaults shares/token')
    .addParam('symbol', 'Symbol of the vaults shares/token')
    .addParam('id', 'ChainID')
    .setAction(async (taskArgs, hre) => {

        // 1. Deploy new FuseERC4626
        const vaultFactory = createFuseVaultFactory(hre.ethers.provider.getSigner())
        const receipt: any = await vaultFactory.deploy(taskArgs.ctoken, taskArgs.name, taskArgs.symbol)

        // 2. Add a boost cap for vault
            // Only those with TURBO_ADMIN_ROLE/4 can set booscaps for strategies
            // The FEI_DAO_TIMELOCK was granted this role.

            // 2.1 seed Fei DAO Timelock
            const signers = await hre.ethers.getSigners()
            const transactionHash = await signers[0].sendTransaction({
                to: TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK,
                value: hre.ethers.utils.parseEther("10"), // Sends exactly 1.0 ether
            });

            console.log(transactionHash)

            // 2.2 Impersonate the Fei Dao Timelock and setBoostCapForVault
            await impersonateAccount(hre.ethers.provider, TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK)
            const signer = await hre.ethers.getSigner(TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK)
            const turboBoosterContract = await createTurboBooster(signer, 1)
            const receipt2 = await turboBoosterContract.setBoostCapForVault(receipt.deployTransaction.creates, parseEther("2000000"))

            console.log({receipt2})
})