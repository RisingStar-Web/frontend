import { Interpolation, Theme } from '@emotion/react'

import { CSSProperties } from 'react'
import { StrategyIdentifier } from './api/base-strategy'

export interface ISearchParams {
  term: string
  size: number
  page: number
  order: 'ASC' | 'DESC'
  orderField: string
}

export type GenericSearchResult<T> = {
  count: number
  hasMore: boolean
  items: Array<T>
  totalPages: number
}

export type ICSSProps = {
  className?: string | undefined
  css?: Interpolation<Theme>
  style?: CSSProperties | undefined
}

export interface IDropdownOption {
  label: string
  value: any
}
export interface ISuccessModal {
  title: string
  content?: string
}

export interface IBaseProps {
  className?: string | undefined
}

export type Maybe<T> = T | null | undefined

export interface TokenDetails {
  name: string
  symbol: string
  decimals: number
  address: string
  logoURI?: string | undefined
}

export interface StakeToken {
  vaultName: string
  annualPercentageYield: number
  totalValueLocked: string
  staked: string
  tokenAddress: string
}

export interface ProfitsAndLosses {
  currencyValue: number
  percentageValue: number
}

export interface PositionRow {
  tokenPair: string
  position: string
  profit: ProfitsAndLosses
  trend: string
}

export enum TransactionType {
  APPROVAL = 'APPROVAL',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  MTS_OPEN_POSITION = 'MTS_OPEN_POSITION',
  MTS_CLOSE_POSITION = 'MTS_CLOSE_POSITION',
  MTS_EDIT_POSTITION = 'MTS_EDIT_POSTITION',
  YEARN_OPEN_POSITION = 'YEARN_OPEN_POSITION',
  YEARN_CLOSE_POSITION = 'YEARN_CLOSE_POSITION',
  YEARN_EDIT_POSTITION = 'YEARN_EDIT_POSTITION',
}

export type TransactionMeta =
  | WithdrawTransactionMeta
  | StakeTransactionMeta
  | ApprovalTransactionMeta
  | MtsOpenPositionMeta
  | ClosePositionMeta
  | MtsEditPositionMeta
  | ClosePositionMeta
  | YearnEditPositionMeta
  | Order
export interface Transaction {
  type: TransactionType
  chainId: number
  meta: TransactionMeta
  tx: string
  status: 'pending' | 'verified'
  receipt?: TransactionReceipt
}

export interface TransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export type CreatableTransaction = Omit<Transaction, 'status'>
export type FinalizableTransaction = Pick<Transaction, 'tx' | 'chainId'> & {
  receipt: TransactionReceipt
}

export enum Approval {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  UNKNOWN = 'UNKNOWN',
  DENIED = 'DENIED',
}

export interface ApprovalTransactionMeta {
  destination: string
  token: string
  amount: number
}

export interface StakeTransactionMeta {
  destination: string
  token: string
  amount: number
}

export interface WithdrawTransactionMeta {
  destination: string
  token: string
  amount: number
}

export interface MtsOpenPositionMeta {
  positionType: PositionType
  spentToken: string
  obtainedToken: string
  margin: string
  slippage: number
  priority: Priority
  leverage: number
  deadline: number
}

export interface ClosePositionMeta {
  positionId: string
  spentToken: string
  obtainedToken: string
}

export interface MtsEditPositionMeta {
  positionId: string
  spentToken: string
  obtainedToken: string
  newCollateral: string
}

export interface YearnEditPositionMeta {
  positionId: string
  newCollateral: string
  token: string
}

export type Priority = 'buy' | 'sell'

export type PositionType = 'long' | 'short'

export type PositionStatus = 'open' | 'closed'

export interface Order {
  spentToken: string
  obtainedToken: string
  margin: string
  slippage: number
  leverage: number
  deadline: number
}

export interface MarginOrder extends Order {
  positionType: PositionType
  priority: Priority
}
export type LeveragedOrder = Order

export interface IPosition {
  positionId: string
  ownerId: string
  strategy: StrategyIdentifier
  status: PositionStatus
  type: PositionType
  spentToken: TokenDetails
  obtainedToken: TokenDetails
  collateralToken: TokenDetails
  collateralReceived: string
  leverage: string
  toBorrow: string
  amountIn: string
  interestRate: string
  openPrice: string
  liquidationPrice: string
  createdAt: number
}

// export interface IPosition {
//   owedToken: string
//   heldToken: string
//   collateralToken: string
//   collateral: number
//   principal: number
//   allowance: number
//   interestRate: number
//   fees: number
//   createdA: number
// }
