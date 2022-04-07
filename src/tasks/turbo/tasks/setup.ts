import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getSafesInfo } from './TurboLens';
import { FEI, TRIBE, TurboAddresses } from '../utils/constants';
import { getRecentEventDecoded } from '../utils/decodeEvents';
import { createCERC20, createFEIContract, createMultiRolesAuthority, createTurboMaster } from '../utils/turboContracts';
import colors from 'colors';
import { impersonateAccount } from '../../../utils/impersonate';
import { constants, Contract } from 'ethers';
import CoreABI from '../abis/Core.sol/ICore.json'
import { commify, formatEther, parseEther } from 'ethers/lib/utils';
import { balanceOf } from '../../../utils/erc20';

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

            console.log(colors.green("\nTurbo setup successful!"))
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

    
})