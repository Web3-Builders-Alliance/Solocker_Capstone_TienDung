import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { IDL, SoLocker } from "./so-locker";


let connection = new Connection(clusterApiUrl("devnet"));
let wallet = new NodeWallet(new Keypair());
const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "processed",
});
anchor.setProvider(provider);

const program = new Program<SoLocker>(IDL, "3xf2u5H4qGaQJbrW5gkcpE38NrXJN5Duru7wtdkjHbcX", { connection })

console.log("Program ID", program.programId.toString());

startListeningToLedSwitchAccount();

async function startListeningToLedSwitchAccount() {
    const accountPDA = await anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from("lock-state"),
        ],
        program.programId,
    )[0];
    console.log("account pda", accountPDA);
    const lockStatePDA = await program.account.lockState.fetch(accountPDA)

    console.log(JSON.stringify(lockStatePDA));
    console.log("lockState is: ", lockStatePDA.isOpen);
    if (lockStatePDA.isOpen) {
        console.log("lockState is on");
    } else {
        console.log("lockState is off");
    }

    connection.onAccountChange(accountPDA, (account) => {
        const decoded = program.coder.accounts.decode(
            "lockState",
            account.data
        )

        if (decoded.isOpen) {
            console.log("lockState is on");
        } else {
            console.log("lockState is off");
        }
        console.log("Account changed", JSON.stringify(decoded));
    }, "processed")
};