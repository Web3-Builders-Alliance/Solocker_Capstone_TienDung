'use client'; // this makes next know that this page should be rendered in the client
import { useEffect, useState } from 'react';
import { CONNECTION, PROGRAM_ID, PROGRAM, PDA } from '@/src/util/const';
import PayQR from '@/src/components/PayQR';
import { Wallet } from '@/src/Wallet';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { Transaction, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
var sha256 = require('sha256')

export default function Home() {
  const [lockState, setLockState] = useState<any>()
  const [isOpen, SetIsOpen] = useState<boolean>();
  // const { connection } = useConnection();
  // const { publicKey, sendTransaction } = useWallet();
  console.log("lockState", lockState)
  useEffect(() => {
    CONNECTION.onAccountChange(
      PDA,
      (updatedAccountInfo, context) => {
        {
          const decoded = PROGRAM.coder.accounts.decode(
            "lockState",
            updatedAccountInfo.data
          )
          setLockState(decoded);
          SetIsOpen(decoded.isOpen);
        }
      },
      "confirmed"
    );

    const getState = async () => {
      const gameData = await PROGRAM.account.lockState.fetch(
        PDA,
      );
      setLockState(gameData);
      SetIsOpen(gameData.isOpen);
    };

    getState();

  }, []);

  return (
    <main className='min-h-screen bg-blue-500 p-2'>
      {<div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-[url('../public/bg.jpg')]">
        <div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-blue-900 bg-opacity-60 pt-4">

          <div className='flex flex-col justify-center'>

          {/* If you want to have wallet connector and call functions from the web page as well this is how you can do it.  */
          /*gameDataState && (
            <>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </>
          )
            <button onClick={RestartGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Restart Game
            </button>
          */}

            <div className='bg-white shadow-md rounded-2xl border-solid border border-black mx-auto w-fit p-2 mb-2'>
              <div className='text-center px-3 pb-6 pt-2'>
                <p className='text-sm text-gray-700 my-4'>
                  Solana Locker
                  <br></br>
                  Scan the QR code to switch the LED on/off via a Solana pay transaction request.
                </p>

                <h2 className='mt-8 text-4xl'>
                  {
                    "Status: " + [lockState ? lockState.isOpen ? "Unlocked" : "Locked" : "loading"]
                  }
                </h2>

              </div>
            </div>

            <li className='flex flex-row justify-between mx-10 text-xl my-4'>

              {isOpen != null && isOpen && (
                <PayQR instruction={"lock"} />
              )}

              {isOpen != null && !isOpen && (
                <PayQR instruction={"unlock"} />
              )}

              {!lockState && (
                <PayQR instruction={"initialize"} />
              )}
            </li>
          </div>          
        </div>       
      </div>}
    </main>
  );
}
