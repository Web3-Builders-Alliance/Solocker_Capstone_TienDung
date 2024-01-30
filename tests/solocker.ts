import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solocker } from "../target/types/solocker";
import { assert } from "chai";
describe("solocker", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solocker as Program<Solocker>;
  const wallet = anchor.workspace.Solocker.provider.wallet
  console.log("Program ID", program.programId.toString());
  it("Is initialized!", async () => {
    const accountPDA = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("lock-state"),
      ],
      program.programId,
    )[0];

    console.log("account pda", accountPDA);
    try {
      const initializeTransaction = await program.methods.initialize().accounts(
        {
          lockState: accountPDA,
          authority: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        } as {
          lockState: anchor.web3.PublicKey;
          authority: anchor.web3.PublicKey;
          systemProgram: anchor.web3.PublicKey;
          rent: anchor.web3.PublicKey;
        },
      ).rpc();
      console.log("Initialize transaction signature: ", initializeTransaction);
    } catch (e) {
      console.log(e);
    }

    const LockTransaction = await program.methods.lock().accounts(
      {
        lockState: accountPDA,
        authority: wallet.publicKey
      },
    ).rpc();
    console.log("Lock transaction signature: ", LockTransaction);
    const UnlockTransaction = await program.methods.unlock().accounts(
      {
        lockState: accountPDA,
        authority: wallet.publicKey
      },
    ).rpc();
    console.log("Unlock transaction signature: ", UnlockTransaction);

    assert(accountPDA != null, "Account PDA is null");

  });
});
