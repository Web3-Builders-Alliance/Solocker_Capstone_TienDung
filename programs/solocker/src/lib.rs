use anchor_lang::prelude::*;

declare_id!("3xf2u5H4qGaQJbrW5gkcpE38NrXJN5Duru7wtdkjHbcX");

#[program]
pub mod solocker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.lock_state.is_open = false;
        Ok(())
    }
    pub fn lock(ctx: Context<Lock>) -> Result<()> {
        if ctx.accounts.lock_state.is_open != true {
            return Err(ErrorCode::AlreadyLocked.into());
        }
        ctx.accounts.lock_state.is_open = false;
        ctx.accounts.lock_state.authority = *ctx.accounts.authority.key;
        Ok(())
    }
    pub fn unlock(ctx: Context<Lock>) -> Result<()> {
        if ctx.accounts.lock_state.is_open != false {
            return Err(ErrorCode::AlreadyUnlocked.into());
        }
        if ctx.accounts.lock_state.authority != *ctx.accounts.authority.key {
            return Err(ErrorCode::Unauthorized.into());
        }
        ctx.accounts.lock_state.is_open = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 8 + 32, seeds = [b"lock-state"], bump)]
    pub lock_state: Account<'info, LockState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Lock<'info> {
    #[account(mut, has_one = authority)]
    pub lock_state: Account<'info, LockState>,
    #[account(signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub authority: AccountInfo<'info>,
}

#[account]
pub struct LockState {
    pub is_open: bool,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not the one who locked this locker")]
    Unauthorized,
    #[msg("Locker is already locked")]
    AlreadyLocked,
    #[msg("Locker is already unlocked")]
    AlreadyUnlocked,
}
