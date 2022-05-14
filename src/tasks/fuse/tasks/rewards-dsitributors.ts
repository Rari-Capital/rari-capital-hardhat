import { task } from "hardhat/config";
import { createRD } from "../utils/fuseContracts";

task('rd-get-admin')
    .addParam('rd', 'Comptroller to get admin from')
    .setAction(async (taskArgs, hre) => {
        
        const rdContract = createRD(
            hre.ethers.provider,
            taskArgs.rd
        )

           
        const admin = await rdContract.admin()

        console.log({admin})
})