import { task } from "hardhat/config";
import { createComptroller } from "../utils/fuseContracts";

task('comptroller-get-admin')
    .addParam('comptroller', 'Comptroller to get admin from')
    .setAction(async (taskArgs, hre) => {
        
        const comptrollerContract = createComptroller(
            hre.ethers.provider,
            taskArgs.comptroller
        )

           
        const admin = await comptrollerContract.admin()

        console.log({admin})
})

task('comptroller-get-rewards-distributors')
    .addParam('comptroller', 'Comptroller to get admin from')
    .setAction(async (taskArgs, hre) => {
        
        const comptrollerContract = createComptroller(
            hre.ethers.provider,
            taskArgs.comptroller
        )

           
        const rewardsDistributors = await comptrollerContract.getRewardsDistributors()

        console.log({rewardsDistributors})
})

task('comptroller-add-rd')
    .addParam('comptroller', 'Comptroller to get admin from')
    .addParam('rd', 'Rewards distributor to add')
    .setAction(async (taskArgs, hre) => {
        
        const comptrollerContract = createComptroller(
            hre.ethers.provider,
            taskArgs.comptroller
        )

        await hre.ethers.provider.send(
            "hardhat_impersonateAccount",
            ['0xB290f2F3FAd4E540D0550985951Cdad2711ac34A'],
        );

        const signer = await hre.ethers.getSigner('0xB290f2F3FAd4E540D0550985951Cdad2711ac34A')

        const connectedContract = comptrollerContract.connect(signer)

        const receipt = await connectedContract._addRewardsDistributor(taskArgs.rd)  
        console.log({receipt}) 
})