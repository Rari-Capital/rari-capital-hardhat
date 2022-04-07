import { providers } from "ethers"
import { createTurboAuthority, ITurboMaster } from "./turboContracts"

export const isUserAuthorizedToCreateSafes = async (
    provider: providers.JsonRpcProvider | providers.Web3Provider, 
    authority: string,
    user: string,
    target: string
) => {
    const turboBoosterContract = await createTurboAuthority(provider, authority)

    const functionSig = ITurboMaster.getSighash('createSafe')

    const authorized = await turboBoosterContract.canCall(
        user,
        target,
        functionSig
    )

    return authorized
}