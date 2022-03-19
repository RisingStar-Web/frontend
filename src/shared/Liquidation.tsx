/** @jsxImportSource @emotion/react */
import 'twin.macro'
import tw from 'twin.macro'
import { useState } from 'react'

import { Txt } from '../shared/Txt'
import { TabsSwitch } from '../shared/TabsSwitch'
import { InputField } from '../shared/InputField'
import { Button } from '../shared/Button'
import { ReactComponent as CurrEth } from '../assets/images/currencyEthereum.svg'
import { ArrowDown } from 'phosphor-react'

interface ILiquidation {
  liquidationToken1: string
  liquidationToken2: string
  onClick: () => void
  inputOnChange: (value: string) => void
  inputValue: string
  liquidationPrice: number
}

export const Liquidation = (props: ILiquidation) => {
  const {
    liquidationPrice,
    liquidationToken1,
    liquidationToken2,
    onClick,
    inputOnChange,
    inputValue,
  } = props

  return (
    <div tw='flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-5'>
      <div tw='w-full flex flex-row justify-between'>
        <Txt.Body2Regular tw='text-secondary'>
          Liquidation Price
        </Txt.Body2Regular>
        <Txt.Body2Bold tw='text-secondary'>
          {liquidationPrice} {liquidationToken1}/{liquidationToken2}
        </Txt.Body2Bold>
      </div>
      <InputField
        label='Top up'
        placeholder='0'
        value={inputValue}
        onChange={(value) => inputOnChange(value)}
        renderRight={
          <Button
            css={[
              tw`bg-primary-400 dark:bg-primary-300 h-6 tablet:h-7 desktop:h-8`,
            ]}
            text='USDC'
            leftIcon={CurrEth}
            rightIcon={ArrowDown}
          />
        }
      />
      <Button text='Top up' action full bold onClick={onClick} />
    </div>
  )
}