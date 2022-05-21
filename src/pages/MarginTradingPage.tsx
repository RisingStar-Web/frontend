import 'twin.macro'

import { Approval, Priority, TokenDetails, TransactionType } from '../types'
import { ArrowRight, FadersHorizontal } from 'phosphor-react'
import { useAddTransaction, useTransaction } from '../state/hooks'

import AdvancedSectionImg from '../assets/images/advancedSectionImage.png'
import { Button } from '../shared/Button'
import { ChartCard } from '../shared/charts/ChartCard'
import { ContentContainer } from '../shared/ContentContainer'
/** @jsxImportSource @emotion/react */
import { FixedNumber } from 'ethers'
import { InfoItem } from '../shared/InfoItem'
import { InputField } from '../shared/InputField'
import { InputFieldMax } from '../shared/InputFieldMax'
import { RadioGroup } from '../shared/RadioGroup'
import { SliderBar } from '../shared/SliderBar'
import { TabsSwitch } from '../shared/TabsSwitch'
import { TokenInputField } from './TokenInputField'
import { Txt } from '../shared/Txt'
import { addresses } from '@ithil-protocol/deployed/latest/addresses.json'
import { etherGlobal } from '../api/ether'
import { getCTALabelForApproval } from '../utils'
import { showErrorNotification } from '../shared/notification'
import { tokens } from '@ithil-protocol/deployed/latest/tokenlist.json'
import { useApprovalAction } from '../shared/hooks/useApprovalAction'
import { useAsync } from 'react-use'
import { useIsConnected } from '../shared/hooks/useIsConnected'
import { useState } from 'react'

export const MarginTradingPage = () => {
  const addTx = useAddTransaction()
  const [positionType, setPositionType] = useState<'short' | 'long'>('long')
  const [spentToken, setSpentToken] = useState<TokenDetails>(tokens[0])
  const [obtainedToken, setObtainedToken] = useState<TokenDetails>(tokens[1])
  const [leverage, setLeverage] = useState<number>(0)
  const [margin, setMargin] = useState<string>('2')
  const [slippage, setSlippage] = useState<any>(1)
  const [deadline, setDeadline] = useState<any>(20)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<any>(false)
  const [priority, setPriority] = useState<Priority>('buy')
  const [buttonText, setButtonText] = useState<any>('')
  const [isLoading, setisLoading] = useState<any>(false)

  const [minObtained, setMinObtained] = useState<FixedNumber>(
    FixedNumber.from('0'),
  )
  const [maxLeverage, setMaxLeverage] = useState<FixedNumber>(
    FixedNumber.from('5'),
  )
  const [maxSpent, setMaxSpent] = useState<FixedNumber>(FixedNumber.from('0'))

  const CreatePosition = async (tokenAddress: string) => {
    setisLoading(
      positionApproval === Approval.PENDING
        ? true
        : !openPositionTx
        ? false
        : openPositionTx.status !== 'verified',
    )

    const getMax = await etherGlobal.getMaxDepositAmount(tokenAddress)
    if (parseInt(margin) > getMax) {
      setButtonText('INSUFFICIENT FUNDS')
    } else {
      setisLoading(true)
      openPosition()
    }
  }
  const isConnected = useIsConnected()
  useAsync(async () => {
    try {
      if (isConnected && slippage && margin) {
        setMaxLeverage(await etherGlobal.marginTrading.getMaxLeverage())
        const [max, min] = await etherGlobal.marginTrading.computeMaxAndMin({
          margin,
          leverage,
          priority,
          positionType,
          slippage,
          deadline,
          obtainedToken: obtainedToken.address,
          spentToken: spentToken.address,
        })
        setMinObtained(min)
        setMaxSpent(max)
      }
    } catch (error) {
      console.error(error)
      showErrorNotification(`Can't compute min obtained and max spent`)
    }
  }, [
    isConnected,
    spentToken.address,
    obtainedToken.address,
    margin,
    leverage,
    priority,
    positionType,
    slippage,
  ])

  const [openPositionHash, setOpenPositionHash] = useState<string | undefined>(
    undefined,
  )
  const openPositionTx = useTransaction(openPositionHash)

  const [positionApproval, openPosition] = useApprovalAction({
    approvalMeta: {
      token: spentToken.address,
      destination: addresses.MarginTradingStrategy,
      amount: Number.MAX_SAFE_INTEGER,
    },
    onApproval: async () => {
      const positionData = {
        positionType,
        spentToken: spentToken.address,
        obtainedToken: obtainedToken.address,
        margin,
        slippage,
        leverage,
        priority,
        deadline,
      }

      const getMax = await etherGlobal.getMaxDepositAmount(spentToken.address)
      if (parseInt(margin) > getMax) {
        setButtonText('Insufficient Funds')
      }

      const position = await etherGlobal.marginTrading.openPosition(
        positionData,
      )
      addTx(TransactionType.MTS_OPEN_POSITION, position.hash, positionData)
      setOpenPositionHash(position.hash)
    },
  })

  return (
    <ContentContainer>
      <div tw='flex flex-col w-full items-center'>
        <div tw='w-full tablet:w-9/12 desktop:w-10/12 flex flex-col items-center'>
          <Txt.Heading1 tw='mb-12'>Margin Trading Strategy </Txt.Heading1>
          <div tw='w-full flex flex-col desktop:flex-row gap-6'>
            <link
              href='https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
              rel='stylesheet'
            />

            <div tw='flex flex-col gap-3 flex-grow w-full desktop:w-4/12'>
              <div tw='flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-7'>
                <TabsSwitch
                  activeIndex={positionType}
                  onChange={(value) => setPositionType(value)}
                  items={[
                    {
                      title: 'Long',
                      value: 'long',
                    },
                    {
                      title: 'Short',
                      value: 'short',
                    },
                  ]}
                />
                <div tw='flex w-full justify-between items-center'>
                  <TokenInputField
                    token={spentToken}
                    onTokenChange={(value) => setSpentToken(value)}
                  />
                  <ArrowRight size={28} tw='text-font-200 mx-6' />
                  <TokenInputField
                    token={obtainedToken}
                    onTokenChange={(value) => setObtainedToken(value)}
                  />
                </div>
                <div tw='w-full'>
                  <InfoItem tooltip label='Leverage' value={`${leverage}x`} />
                  <InfoItem
                    tooltip
                    label='Min. obtained'
                    value={minObtained.round(4).toString()}
                  />
                  <InfoItem
                    tooltip
                    label='Max. spent'
                    value={maxSpent.round(4).toString()}
                  />
                </div>
                <InputFieldMax
                  label='Margin'
                  placeholder='0'
                  unit={spentToken.symbol}
                  address={spentToken.address}
                  value={margin.toString()}
                  StateChanger={setMargin}
                  onChange={(value) => {
                    setMargin(value)
                    setButtonText('')
                  }}
                  renderRight={
                    <Txt.InputText tw='text-font-100'>
                      {spentToken.symbol}
                    </Txt.InputText>
                  }
                />
                <SliderBar
                  label='Leverage'
                  tooltip
                  min={1}
                  max={Number(maxLeverage.toString())}
                  step={0.2}
                  value={leverage}
                  onChange={(value) => setLeverage(value)}
                />
                <div tw='w-full'>
                  {showAdvancedOptions ? (
                    <>
                      <div tw='my-4 w-full flex flex-row justify-between items-center'>
                        <Txt.Heading2>Advanced options</Txt.Heading2>
                        <div>
                          {' '}
                          <svg
                            role='status'
                            className='inline w-4 h-4 mr-3 text-white animate-spin'
                            viewBox='0 0 100 101'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                              fill='#E5E7EB'
                            />
                            <path
                              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                              fill='currentColor'
                            />
                          </svg>
                        </div>
                      </div>
                      <img
                        tw='w-full my-5'
                        src={AdvancedSectionImg}
                        alt='advancedSectionPlaceholder'
                      />
                      <div tw='flex flex-col w-full gap-7'>
                        <InputField
                          tooltip
                          label='Slippage'
                          placeholder='0'
                          value={slippage}
                          onChange={(value) => setSlippage(value)}
                          renderRight={
                            <Txt.InputText tw='text-font-100'>%</Txt.InputText>
                          }
                        />
                        <RadioGroup
                          tooltip
                          label='Priority'
                          items={[
                            {
                              label: 'Buy',
                              value: 'buy',
                            },
                            {
                              label: 'Sell',
                              value: 'sell',
                            },
                          ]}
                          activeRadio={priority}
                          onChange={(value) => setPriority(value as Priority)}
                        />
                        <InputField
                          tooltip
                          label='Deadline'
                          placeholder='30 mins'
                          value={deadline}
                          onChange={(value) => setDeadline(value)}
                          renderRight={
                            <Txt.InputText tw='text-font-100'>
                              min
                            </Txt.InputText>
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      tw='my-4 w-full flex justify-center items-center gap-2'
                      onClick={() =>
                        setShowAdvancedOptions(!showAdvancedOptions)
                      }
                    >
                      <FadersHorizontal size={20} tw='text-font-100' />
                      <Txt.Body2Regular tw='text-font-100'>
                        Advanced options
                      </Txt.Body2Regular>
                    </button>
                  )}
                </div>
                <Button
                  text={
                    buttonText
                      ? buttonText
                      : getCTALabelForApproval(
                          `${priority.toUpperCase()} / ${positionType.toUpperCase()} TKN`,
                          positionApproval,
                        )
                  }
                  full
                  action
                  bold
                  isLoading={isLoading}
                  onClick={() => {
                    CreatePosition(spentToken.address)
                  }}
                />
                <Txt.CaptionMedium>
                  {!openPositionTx
                    ? ''
                    : openPositionTx.status == 'verified'
                    ? 'Transaction verified.'
                    : 'Transaction pending...'}
                </Txt.CaptionMedium>
              </div>
            </div>
            <ChartCard
              firstToken={obtainedToken}
              secondToken={spentToken}
              disableTrading={false}
            />
          </div>
        </div>
      </div>
    </ContentContainer>
  )
}
