import React, { useState } from 'react'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import Row, { RowBetween } from '../Row'
// import DropdownSelect from '../../components/DropdownSelect'
// import { useAllTokens } from '../../contexts/TokenData'
import { toK, toNiceDate, toNiceDateYear } from '../../helpers'
import { OptionButton } from '../ButtonStyled'

const ChartWrapper = styled.div`
  /* margin-left: -1em; */
`

const GlobalChart = ({ chartData }) => {
  // const tokens = useAllTokens()

  // const newData =
  //   chartData &&
  //   chartData.map(dayItem => {
  //     let formattedItem = {}
  //     const total = dayItem.totalLiquidityUSD
  //     let sum = 0
  //     formattedItem.date = dayItem.date
  //     dayItem.mostLiquidTokens.map(tokenDayData => {
  //       sum += parseFloat(tokenDayData.totalLiquidityUSD)
  //       return (formattedItem[tokenDayData.token.id] = tokenDayData.totalLiquidityUSD)
  //     })
  //     formattedItem['other'] = total - sum
  //     return formattedItem
  //   })

  // const colors = [
  //   {
  //     key: 'key1',
  //     color: 'rgba(239, 131, 78, 1)',
  //     border: 'rgba(239, 131, 78, 1)'
  //   },
  //   {
  //     key: 'key2',
  //     color: 'rgba(69, 142, 250 , 1)',
  //     border: 'rgba(69, 142, 250 , 1)'
  //   },
  //   {
  //     key: 'key3',
  //     color: 'rgba(250, 69, 69, 1)',
  //     border: 'rgba(250, 69, 69, 1)'
  //   },
  //   {
  //     key: 'key4',
  //     color: 'rgba(131, 78, 239, 1)',
  //     border: 'rgba(131, 78, 239, 1)'
  //   }
  // ]

  // let colorIndex = 0
  // let colorMax = colors.length - 1
  // function updateIndex() {
  //   colorIndex = colorIndex + 1
  //   if (colorIndex > colorMax) {
  //     colorIndex = 0
  //   }
  // }

  const [chartFilter, setChartFilter] = useState('liqRaw')
  const [timeWindow, setTimeWindow] = useState('week')

  return chartData ? (
    <ChartWrapper>
      <RowBetween marginBottom={'10px'}>
        <Row>
          <OptionButton
            style={{ marginRight: '10px' }}
            active={chartFilter === 'liqRaw'}
            onClick={() => setChartFilter('liqRaw')}
          >
            Liquidity
          </OptionButton>
          <OptionButton
            style={{ marginRight: '10px' }}
            active={chartFilter === 'vol'}
            onClick={() => setChartFilter('vol')}
          >
            Volume
          </OptionButton>
        </Row>
        <Row justify="flex-end">
          <OptionButton
            style={{ marginRight: '10px' }}
            active={timeWindow === 'week'}
            onClick={() => setTimeWindow('week')}
          >
            1 Week
          </OptionButton>
          <OptionButton
            style={{ marginRight: '10px' }}
            active={timeWindow === 'month'}
            onClick={() => setTimeWindow('month')}
          >
            1 Month
          </OptionButton>
          <OptionButton active={timeWindow === 'all'} onClick={() => setTimeWindow('all')}>
            All Time
          </OptionButton>
        </Row>
        {/* <DropdownSelect options={options} active={timeline} setActive={setTimeline} /> */}
      </RowBetween>
      {chartFilter === 'liqRaw' && chartData && (
        <ResponsiveContainer aspect={60 / 28}>
          <AreaChart margin={{ top: 20, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff007a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ff007a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={20}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: 'black' }}
            />
            <YAxis
              type="number"
              orientation="left"
              tickFormatter={tick => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval={0}
              minTickGap={50}
              // mirror={true}
              yAxisId={0}
              padding={{ top: 20, bottom: 20 }}
              tick={{ fill: 'black' }}
            />
            <Tooltip
              cursor={{ stroke: 'white', strokeWidth: 1 }}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 5,
                borderColor: '#ff007a',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) '
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              key={'other'}
              dataKey={'totalLiquidityUSD'}
              stackId="2"
              strokeWidth={2}
              stroke="rgb(255, 0, 122, 1)"
              dot={false}
              type="monotone"
              name={'Liquidity'}
              yAxisId={0}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {/* {chartFilter === 'breakdown' && (
        <ResponsiveContainer aspect={60 / 28}>
          <AreaChart margin={{ top: 10, right: 0, bottom: 6, left: 0 }} barCategoryGap={1} data={newData}>
            <defs>
              {colors.map((color, i) => {
                return (
                  <linearGradient key={i} id={color.key} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color.color} stopOpacity={0.2} />
                  </linearGradient>
                )
              })}
            </defs>
            <Legend
              margin={{ top: 40, left: 0, right: 0, bottom: 0 }}
              iconType="circle"
              wrapperStyle={{ paddingTop: '40px' }}
            />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={120}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: 'black' }}
            />
            <YAxis
              type="number"
              // tickMargin={46}
              orientation="left"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              // mirror={true}
              yAxisId={0}
              tick={{ fill: 'black' }}
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: 'var(--c-zircon)'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            {tokens &&
              tokens.map(token => {
                updateIndex()
                return (
                  <Area
                    key={token.id}
                    dataKey={token.id}
                    stackId="2"
                    strokeWidth={2}
                    dot={false}
                    type="monotone"
                    name={token.symbol}
                    yAxisId={0}
                    fill={'url(#' + colors[colorIndex].key + ')'}
                    stroke={colors[colorIndex].border}
                  />
                )
              })}
            <Area
              key={'other'}
              dataKey={'other'}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={'Other'}
              yAxisId={0}
              fill={'url(#' + colors[colorIndex].key + ')'}
              stroke={colors[colorIndex].border}
            />
          </AreaChart>
        </ResponsiveContainer>
      )} */}
      {chartFilter === 'vol' && (
        <ResponsiveContainer aspect={60 / 28}>
          <BarChart margin={{ top: 20, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: 'black' }}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={tick => '$' + toK(tick, true, true)}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: 'black' }}
              domain={[0, 'dataMax']}
            />
            <Tooltip
              cursor={{ fill: '#ff007a', opacity: 0.1 }}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: 'red',
                color: 'black'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Bar
              type="monotone"
              name={'Volume'}
              dataKey={'dailyVolumeUSD'}
              fill="#ff007a"
              opacity={'0.4'}
              yAxisId={0}
              stroke="rgba(254, 109, 222, 0.8)"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartWrapper>
  ) : (
    ''
  )
}

export default GlobalChart
