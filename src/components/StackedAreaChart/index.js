import React, { useState } from "react"
import styled from "styled-components"
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  BarChart,
  Bar
} from "recharts"
import Row from "../Row"
import DropdownSelect from "../../components/DropdownSelect"

import { useAllTokens } from "../../contexts/TokenData"

import { toK, toNiceDate, toNiceDateYear } from "../../helpers"

const ChartWrapper = styled.div`
  /* margin-left: -1em; */
  margin-top: 40px;
`

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`

const Option = styled.div`
  font-weight: ${({ active }) => (active ? "500" : "400")};
  &:hover {
    cursor: pointer;
  }
`

const StackedAreaChart = ({ chartData, token }) => {
  const tokens = useAllTokens()
  const newData =
    chartData &&
    chartData.map(dayItem => {
      let formattedItem = {}
      const total = parseFloat(dayItem.totalLiquidityUSD)
      let sum = 0
      formattedItem.date = dayItem.date
      dayItem.mostLiquidPairs.map(exchangeDayData => {
        if (exchangeDayData.token0.id === token) {
          const usdAmount =
            exchangeDayData.token0Balance *
            exchangeDayData.token0.derivedETH *
            100
          sum += usdAmount
          return (formattedItem[exchangeDayData.token1.id] = usdAmount)
        } else {
          const usdAmount =
            exchangeDayData.token1Balance *
            exchangeDayData.token1.derivedETH *
            100
          sum += usdAmount
          return (formattedItem[exchangeDayData.token0.id] = usdAmount)
        }
      })
      formattedItem["other"] = total - sum
      return formattedItem
    })

  const colors = [
    {
      key: "key1",
      color: "rgba(255, 173, 0, 0.8)",
      border: "rgba(255, 173, 0, 1)"
    },
    {
      key: "key2",
      color: "rgba(69, 142, 250 , 0.2)",
      border: "rgba(69, 142, 250 , 0.8)"
    },
    {
      key: "key3",
      color: "rgba(250, 69, 69, 0.2)",
      border: "rgba(250, 69, 69, 0.4)"
    }
  ]

  let colorIndex = 0
  let colorMax = colors.length - 1
  function updateIndex() {
    colorIndex = colorIndex + 1
    if (colorIndex > colorMax) {
      colorIndex = 0
    }
  }

  const options = [
    { text: "All Time" },
    { text: "3 Months" },
    { text: "1 week" }
  ]
  const [chartFilter, setChartFilter] = useState("liq")
  const [timeline, setTimeline] = useState(options[0])

  return (
    <ChartWrapper>
      <OptionsWrapper>
        <Row>
          <Option
            style={{ marginRight: "20px" }}
            active={chartFilter === "liq"}
            onClick={() => setChartFilter("liq")}
          >
            Liquidity
          </Option>
          <Option
            active={chartFilter === "vol"}
            onClick={() => setChartFilter("vol")}
          >
            Volume
          </Option>
        </Row>
        <DropdownSelect
          options={options}
          active={timeline}
          setActive={setTimeline}
        />
      </OptionsWrapper>
      {chartFilter === "liqRaw" && chartData && (
        <ResponsiveContainer aspect={60 / 12}>
          <AreaChart
            margin={{ top: 10, right: 0, bottom: 6, left: 0 }}
            barCategoryGap={1}
            data={chartData}
          >
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={120}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: "black" }}
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
              tick={{ fill: "black" }}
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: "10px 14px",
                borderRadius: 10,
                borderColor: "var(--c-zircon)"
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              key={"other"}
              dataKey={"totalLiquidityUSD"}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={"Liquidity"}
              yAxisId={0}
              fill={"none"}
              stroke={"black"}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {chartFilter === "liq" && newData && (
        <ResponsiveContainer aspect={60 / 12}>
          <AreaChart
            margin={{ top: 10, right: 0, bottom: 6, left: 0 }}
            barCategoryGap={1}
            data={newData}
          >
            <defs>
              {colors.map((color, i) => {
                return (
                  <linearGradient
                    key={i}
                    id={color.key}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={color.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={color.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                )
              })}
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={120}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: "black" }}
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
              tick={{ fill: "black" }}
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: "10px 14px",
                borderRadius: 10,
                borderColor: "var(--c-zircon)"
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
                    fill={"url(#" + colors[colorIndex].key + ")"}
                    stroke={colors[colorIndex].border}
                  />
                )
              })}
            <Area
              key={"other"}
              dataKey={"other"}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={"Other"}
              yAxisId={0}
              fill={"url(#" + colors[colorIndex].key + ")"}
              stroke={colors[colorIndex].border}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {chartFilter === "vol" && (
        <ResponsiveContainer aspect={60 / 12}>
          <BarChart
            margin={{ top: 0, right: 0, bottom: 6, left: 10 }}
            barCategoryGap={1}
            data={chartData}
          >
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
            />
            <YAxis
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={tick => toK(tick)}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: "10px 14px",
                borderRadius: 10,
                borderColor: "var(--c-zircon)"
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Bar
              type="monotone"
              name={"Volume"}
              dataKey={"dailyVolumeUSD"}
              fill="rgba(254, 109, 222, 0.6)"
              opacity={"0.4"}
              yAxisId={0}
              stroke="rgba(254, 109, 222, 0.8)"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartWrapper>
  )
}

export default StackedAreaChart
