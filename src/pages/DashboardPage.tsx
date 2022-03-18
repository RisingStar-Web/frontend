/** @jsxImportSource @emotion/react */
import 'twin.macro'
import tw from 'twin.macro'

import { ContentContainer } from '../shared/ContentContainer'
import { CustomTable } from '../shared/table/CustomTable'
import { ISearchParams } from '../types'
import { TableCell } from '../shared/table/cells'
import { Txt } from '../shared/Txt'
import { useSearch } from '../shared/hooks/useSearch'
import { useEffect, useState } from 'react'
import { useInitPositions, usePositions } from '../state/hooks'
import { useIsConnected } from '../shared/hooks/useIsConnected'
import { Button } from '../shared/Button'

const initialSearchParams: Partial<ISearchParams> = {
  orderField: 'name',
  order: 'ASC',
  term: '',
}

const positionsData: any[] = []

export const DashboardPage = () => {
  // const [search, setSearch] = useState('')
  const [searchParams, { setPage }] = useSearch(initialSearchParams)
  const [activeTab, setActiveTab] = useState('active')
  const initPositions = useInitPositions()
  const positions = usePositions()

  useEffect(() => {
    initPositions()
    console.log('Positions: ', positions)
    console.log('Positions table data: ', positionsData)
  }, [useIsConnected()])

  return (
    <ContentContainer>
      <div tw='flex flex-col w-full items-center'>
        <div tw='w-full desktop:w-10/12 flex flex-col items-center'>
          <Txt.Heading1 tw='mb-12'>Dashboard</Txt.Heading1>

          {positions && positions.length > 0 ? (
            <>
              <div tw='flex flex-row justify-center items-center gap-3 self-start mb-4 ml-4'>
                <Txt.Body1Regular>View:</Txt.Body1Regular>
                <Button
                  text='Active'
                  action={activeTab === 'active'}
                  bold={activeTab === 'active'}
                  onClick={() => setActiveTab('active')}
                />
                <Button
                  text='Closed'
                  action={activeTab === 'closed'}
                  bold={activeTab === 'closed'}
                  onClick={() => setActiveTab('closed')}
                />
              </div>
              <CustomTable
                loading={false}
                maxPage={
                  positions.length > 0
                    ? positions.length / searchParams.size
                    : 1
                }
                currentPage={searchParams.page}
                setPage={setPage}
                pageSize={searchParams.size}
                data={positions.length > 0 ? positions : []}
                mobileColumns={[
                  {
                    Header: 'TokenPair',
                    accessor: 'tokenPair',
                    align: 'left',
                    cell: (l) => <TableCell.Text value={l.tokenPair} />,
                  },
                  {
                    Header: 'Position',
                    accessor: 'position',
                    align: 'left',
                    cell: (l) => <TableCell.Text value={l.position} />,
                  },
                  {
                    Header: 'Profit',
                    accessor: 'profit',
                    align: 'left',
                    cell: (l) => (
                      <TableCell.Profit
                        currencyValue={l.profit.currencyValue}
                        percentageValue={l.profit.percentageValue}
                      />
                    ),
                  },
                ]}
                columns={[
                  {
                    Header: 'TokenPair',
                    accessor: 'tokenPair',
                    align: 'left',
                    cell: (l) => <TableCell.Text value={l.tokenPair} />,
                  },
                  {
                    Header: 'Position',
                    accessor: 'position',
                    align: 'center',
                    cell: (l) => <TableCell.Text value={l.position} />,
                  },
                  {
                    Header: 'Profit',
                    accessor: 'profit',
                    align: 'right',
                    cell: (l) => (
                      <TableCell.Profit
                        currencyValue={l.profit.currencyValue}
                        percentageValue={l.profit.percentageValue}
                      />
                    ),
                  },
                  {
                    Header: 'Trend',
                    accessor: 'trend',
                    align: 'center',
                    cell: (l) => <TableCell.Text value={l.trend} />,
                  },
                  {
                    Header: '',
                    accessor: 'close',
                    align: 'right',
                    cell: (l) => <TableCell.ClosePosition />,
                  },
                ]}
              />
            </>
          ) : (
            'Connect wallet'
          )}
        </div>
      </div>
      {/* <TokenModal modalIsOpen onChange={() => {}} /> */}
    </ContentContainer>
  )
}
