import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { IDL, SoLocker } from "./so-locker";

export const CONNECTION = new Connection(process.env.NEXT_PUBLIC_RPC ? process.env.NEXT_PUBLIC_RPC : 'https://api.devnet.solana.com', {
  wsEndpoint: process.env.NEXT_PUBLIC_WSS_RPC ? process.env.NEXT_PUBLIC_WSS_RPC : "wss://api.devnet.solana.com",
  commitment: 'confirmed'
});

const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "";

export const PROGRAM_ID = new PublicKey(programId);

export const PROGRAM = new Program<SoLocker>(IDL, PROGRAM_ID, { connection: CONNECTION })

export const PDA = PublicKey.findProgramAddressSync(
  [
    Buffer.from("lock-state"),
  ],
  PROGRAM_ID,
)[0];