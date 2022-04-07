// import { task } from "hardhat/config";
// import { createRD } from "../utils/fuseContracts";

// task('comptroller-get-admin')
//     .addParam('rd', 'Comptroller to get admin from')
//     .setAction(async (taskArgs, hre) => {
        
//         const comptrollerContract = createRD(
//             hre.ethers.provider,
//             taskArgs.rd
//         )

           
//         const admin = await comptrollerContract.admin()

//         console.log({admin})
// })