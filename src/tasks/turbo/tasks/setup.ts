import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Turbo utils
import { FEI, TRIBE, TurboAddresses } from '../utils/constants';
import { createCERC20, createFEIContract, createFuseVaultFactory, createMultiRolesAuthority, createTurboBooster, createTurboMaster } from '../utils/turboContracts';
import { impersonateAccount } from '../../../utils/impersonate';
import { balanceOf } from '../../../utils/erc20';

// Console.log utils
import colors from 'colors';

// Ethers
import { constants, Contract } from 'ethers';
import { commify, formatEther, parseEther } from 'ethers/lib/utils';

// ABIs
import CoreABI from '../abis/Core.sol/ICore.json'

task('setup-turbo', "Will get all available safes")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {
   
    console.log(colors.yellow("Turbo setup initiated"))
    console.log(colors.yellow("\n1. Impersonating and seeding the FEI DAO Timelock"))

    const signers = await hre.ethers.getSigners()
    const transactionHash = await signers[0].sendTransaction({
        to: TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK,
        value: hre.ethers.utils.parseEther("10"), // Sends exactly 1.0 ether
    });

    console.log(colors.green("\tFei DAI Timelock seeded with: " + hre.ethers.utils.formatEther(transactionHash.value) + " ETH"))

    let signer
    try {
        await impersonateAccount(hre.ethers.provider, TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK)
        signer = await hre.ethers.getSigner(TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK)
        console.log(colors.green("\tImpersonation successful"))
    } catch (e) {
        console.error(e)
    }

    console.log(colors.yellow("\n2. Sending 10M TRIBE to hh account 0"))

    const CoreContract = new Contract(
        "0x8d5ED43dCa8C2F7dFB20CF7b53CC7E593635d7b9",
        CoreABI.abi,
        signer
    )

    try {
        await CoreContract.allocateTribe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", parseEther("10000000"))
        const balance = await balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", TRIBE, signer)

        console.log(colors.green("\tTransfer successful. Account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 holds: " + commify(formatEther(balance)) + " TRIBE"))
    } catch (e) {
        console.log(e)
    }

    console.log(colors.yellow("\n3. Seeding turbo pool's fei market"))

    const feiContract = createFEIContract(signer)
    const turboFeiMarketContract = await createCERC20(hre,TurboAddresses[taskArgs.id].TURBO_FEI_MARKET)
    const connecterContract = signer ? turboFeiMarketContract.connect(signer) : null

    
    try {
        await feiContract.mint(TurboAddresses[taskArgs.id].FEI_DAO_TIMELOCK, parseEther("10000000"))
        await feiContract.approve(TurboAddresses[taskArgs.id].TURBO_FEI_MARKET, constants.MaxUint256)
        await connecterContract?.mint(parseEther("10000000"))
        const balance = await balanceOf(TurboAddresses[taskArgs.id].TURBO_FEI_MARKET, FEI, signer)
        
        console.log(
            colors.green(
                "\tTurbo FEI market seeded. Available liquidity: " 
                + commify(formatEther(balance)) 
                + " FEI"
            )
        )
    } catch (e) {
        console.error(e)
    }

    console.log(colors.yellow("\n4. Granting TURBO_ADMIN_ROLE to the Turbo Router and HH address 0"))

    let turboTimelockSigner
    try {
        const signers = await hre.ethers.getSigners()
        const transactionHash = await signers[0].sendTransaction({
            to: TurboAddresses[taskArgs.id].TURBO_TIMELOCK,
            value: hre.ethers.utils.parseEther("10"), // Sends exactly 1.0 ether
        });

        await impersonateAccount(hre.ethers.provider, TurboAddresses[taskArgs.id].TURBO_TIMELOCK)
        turboTimelockSigner = await hre.ethers.getSigner(TurboAddresses[taskArgs.id].TURBO_TIMELOCK)
    } catch (e) {
        console.error(e)
    }

    const turboAuthorityContract = await createMultiRolesAuthority(
        hre,
        TurboAddresses[taskArgs.id].TURBO_AUTHORITY
    )
    const impersonatedTurboAuthorityContract = turboTimelockSigner ? turboAuthorityContract.connect(turboTimelockSigner) : null

    try {
        await impersonatedTurboAuthorityContract?.setUserRole(
            TurboAddresses[taskArgs.id].ROUTER,
            4,
            true
        )

        await impersonatedTurboAuthorityContract?.setUserRole(
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            4,
            true
        )

        const routerHasRole = await impersonatedTurboAuthorityContract?.callStatic.doesUserHaveRole(TurboAddresses[taskArgs.id].ROUTER, 4)
        const hhHasRole = await impersonatedTurboAuthorityContract?.callStatic.doesUserHaveRole("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",4)

        if (routerHasRole && hhHasRole) {
            console.log(
                colors.green(
                    "\tTransaction sucessful. You can now use the Router and HH address 0 to create safes."
                )
            )
        } else {
            console.log(
                colors.red(
                    "\tAuthorization failed. Please check the node's logs and try again."
                )
            )
        }
    } catch (e) {
        console.error(e)
    } 


    console.log(colors.yellow("\n5. Deploying strategies."))

    console.log(colors.yellow("\t5.1 Deploying Tribe Convex Fei wrapper vault."))
    // 1. Deploy new FuseERC4626

    let tribeConvexFei: any
    try {
        const vaultFactory = createFuseVaultFactory(hre.ethers.provider.getSigner())
        tribeConvexFei= await vaultFactory.deploy("0x001E407f497e024B9fb1CB93ef841F43D645CA4F", "Tribe Convex FEI", "wfFEI-156")
        console.log(colors.green("\t\tDeployment successful."))
    } catch (e) {
        console.error(e)
    }

    console.log(colors.yellow("\t5.2 Deploying Olympus Pool Fei wrapper vault."))
    // 1. Deploy new FuseERC4626

    let olympusPoolFei: any
    try {
        const vaultFactory = createFuseVaultFactory(hre.ethers.provider.getSigner())
        olympusPoolFei= await vaultFactory.deploy("0x17b1A2E012cC4C31f83B90FF11d3942857664efc", "Olympus Party FEI", "wfFEI-18")
        console.log(colors.green("\t\tDeployment successful."))
    } catch (e) {
        console.error(e)
    }

    console.log(colors.yellow("\n6. Whitelisting strategies."))

    try  {   
        // 2.2 Impersonate the Fei Dao Timelock and setBoostCapForVault
        const turboBoosterContract = await createTurboBooster(signer, 1)
        await turboBoosterContract.setBoostCapForVault(tribeConvexFei.deployTransaction.creates, parseEther("2000000"))
        await turboBoosterContract.setBoostCapForVault(olympusPoolFei.deployTransaction.creates, parseEther("2000000"))

        const boostableVaults = await turboBoosterContract.getBoostableVaults()

        if (boostableVaults.length === 3) {
            console.log(colors.green("\tTransaction successful. Strategies are whitelisted."))
        }
    } catch (e) {
        console.error(e)
    }


    console.log(colors.green("\nTurbo setup successful!") + "\u0007")
    
})