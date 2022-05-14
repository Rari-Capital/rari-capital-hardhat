import colors from "colors";
import { ethers } from "ethers";
import { task } from "hardhat/config";
import { TRIBE, TurboAddresses } from "../../turbo/utils/constants";
import MutiRolesAuthority from '../abis/MultiRolesAuthority.sol/MultiRolesAuthority.json'
import xTRIBE from '../abis/xTRIBE.sol/xTRIBE.json'

// import { createComptroller } from "../utils/fuseContracts";

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('xtribe-setup', "Will get weight of given gauge")
    .setAction(async (taskArgs, hre) => {
        const signer = await hre.ethers.getSigners()
        
        console.log(
            colors.yellow("============= Initiating xTribe setup. ==============")
        )

        console.log(
            colors.yellow("\n 1. Deploying MultiRolesAuthority.")
        )

        let authority
        try {
            const receipt = await (new ethers.ContractFactory(
                MutiRolesAuthority.abi,
                MutiRolesAuthority.bytecode,
                signer[0]
            )).deploy(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
                "0x0000000000000000000000000000000000000000"
            )

            console.log(
                colors.green("\tDeployment successful! Deployed to: " + receipt.address)
            )

            authority = receipt
        } catch (e) {
            console.error(e)
            throw e
        }

        console.log(
            colors.yellow("\n 2. Deploying xTRIBE.")
        )

        let xTribe
        try {
            xTribe = await (new ethers.ContractFactory(
                xTRIBE.abi,
                xTRIBE.bytecode,
                signer[0]
            )).deploy(
                TRIBE, 
                TurboAddresses[1].FEI_DAO_TIMELOCK,
                authority.address,
                1209600, // Rewards cycle 2 weeks
                172800 //Increment freeze window 2 days
            )

            console.log({xTribe})

            const Arguments = {
                ERC20: TRIBE,
                OWNER: TurboAddresses[1].FEI_DAO_TIMELOCK,
                Authority: authority.address,
                RewardsCycle: "2 Weeks",
                IncrementFreezeWindow: "2 Days"
            }

            console.log(
                colors.green("\tDeployment successful! Deployed to: " + xTribe.address
                )
            )

            console.table(Arguments)
        } catch (e) {
            console.error(e)
            throw e
        }

        console.log(
            colors.yellow("\n 3. Configuring Authority.")
        )

        try {

            console.log({authority, ts: xTribe.setMaxDelegates.selector})

            await authority.setRoleCapability(
                1,
                xTribe.setMaxDelegates,
                true
            );

            console.log("one")

            await authority.setRoleCapability(
                1,
                xTribe.setMaxGauges.selector,
                true
            );

            console.log("two")

            await authority.setRoleCapability(
                1, 
                xTribe.addGauge.selector, 
                true
            );

            console.log("three")

            await authority.setUserRole(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
                1, 
                true
            );

            console.log("four")

            console.log(
                colors.green("\tConfiguration successful.")
            )
        } catch (e) {
            console.error(e)
            throw e
        }

        console.log(
            colors.yellow("\n 4. Configuring and adding gauges.")
        )

        try {
            await xTribe.setMaxDelegates(
                0x0000000000000000000000000000000000000000000000000000000000000019
            );
            
            await xTribe.setMaxGauges(
                0x0000000000000000000000000000000000000000000000000000000000000019
            );

            const gauges = [
                0xBFB6f7532d2DB0fE4D83aBb001c5C2B0842AF4dB,
                0xFd3300A9a74b3250F1b2AbC12B47611171910b07,
                0xb723e1dBD267D215B40C2be756B158F83b68503B,
                0x5cA8Ffe4DAD9452ED880FA429DD0A08574225936,
                0x30fA046Ba48C193230722Ec9068ba7234E40FFd2
            ];

            for (const gauge of gauges) {
                xTribe.addGauge(gauge);
            }

        } catch (e) {
            console.error(e)
        }

        console.log(
            colors.green("\n 5 gauges where added.")
        )


})