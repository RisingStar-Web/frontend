import { StakeToken } from '../../types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { etherGlobal } from '../../api/ether'
import tokenList from '@ithil-protocol/deployed/latest/tokenlist.json'

export const initializeUserStakes = createAsyncThunk<any, number>(
  'stake/initializeUserStakes',
  async (chainId) => {
    const chainTokens = tokenList.tokens.filter(
      (token) => token.chainId == chainId,
    )
    const stakes: StakeToken[] = []

    for (const token of chainTokens) {
      try {
        const totalValueLocked = await etherGlobal.getTokenTvl(token.address)
        const staked = await etherGlobal.getMaxWithdrawAmount(token.address)
        const annualPercentageYield =
          await etherGlobal.computeAnnualPercentageYield(token.address)
        stakes.push({
          vaultName: token.symbol,
          annualPercentageYield,
          totalValueLocked,
          staked,
          tokenAddress: token.address,
        })
      } catch (e) {
        console.error(e)
      }
    }
    return stakes
  },
)
