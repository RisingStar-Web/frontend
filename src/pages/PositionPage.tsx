import 'twin.macro'

import { BasicChart } from '../shared/charts/BasicChart'
import { CollateralCard } from '../shared/CollateralCard'
import { ContentContainer } from '../shared/ContentContainer'
import { PositionDetailsCard } from '../shared/PositionDetailsCard'
import { TabButton } from '../shared/TabButton'
import { TradingChart } from '../shared/charts/TradingChart'
import { Txt } from '../shared/Txt'
/** @jsxImportSource @emotion/react */
import { useState } from 'react'

export const PositionPage = () => {
  const [activeChart, setActiveChart] = useState<'basic' | 'trading'>('basic')

  return (
    <ContentContainer>
      <div tw='flex flex-col w-full items-center'>
        <div tw='w-full tablet:w-9/12 desktop:w-10/12 flex flex-col items-center'>
          <Txt.Heading1 tw='mb-12'>ETH/ETH</Txt.Heading1>
          <div tw='w-full flex flex-col desktop:flex-row gap-6'>
            <div tw='flex flex-col gap-3 flex-grow'>
              <PositionDetailsCard />
              <CollateralCard />
              <div tw='flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100'>
                <Txt.Body2Regular>
                  Placeholder-Liquidation price
                </Txt.Body2Regular>
              </div>
              <div tw='flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100'>
                <Txt.Body2Regular>Placeholder-Position value</Txt.Body2Regular>
              </div>
            </div>
            <div tw='w-full desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 desktop:p-10 bg-primary-100'>
              <div tw='w-full flex flex-row justify-between pb-5 '>
                <Txt.Heading2>ETH/USDC</Txt.Heading2>
                <div tw='hidden desktop:flex flex-row items-center gap-1'>
                  <Txt.Body2Regular tw='mr-4'>View:</Txt.Body2Regular>
                  <TabButton
                    text='Basic'
                    active={activeChart === 'basic'}
                    onClick={() => setActiveChart('basic')}
                  />
                  <TabButton
                    text='Trading'
                    active={activeChart === 'trading'}
                    onClick={() => setActiveChart('trading')}
                  />
                </div>
              </div>
              <div tw='w-full h-full  flex flex-col'>
                {activeChart === 'basic' ? (
                  <BasicChart width={0} />
                ) : (
                  <TradingChart />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  )
}