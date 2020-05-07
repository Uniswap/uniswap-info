import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
import TokenLogo from '../TokenLogo'
import { CustomLink } from '../Link'
import Row from '../Row'
import LocalLoader from '../LocalLoader'
import { Divider } from '..'

import { useCurrentCurrency } from '../../contexts/Application'
import { formattedNum } from '../../helpers'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 2em;
`

const Arrow = styled.div`
  color: #2f80ed;
  opacity: ${props => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'action value Time';
  padding: 0 6px;

  > * {
    justify-content: flex-end;
    width: 100%;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 40em) {
    max-width: 1280px;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr;
    grid-template-areas: 'action value Time';

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 64em) {
    max-width: 1320px;
    display: grid;
    padding: 0 24px;
    grid-gap: 1em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name symbol price liq vol change';
  }
`

const ListWrapper = styled.div`
  @media screen and (max-width: 40em) {
    padding-right: 1rem;
    padding-left: 1rem;
  }
`

const ClickableText = styled(Text)`
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
`

const DataText = styled(Flex)`
  @media screen and (max-width: 40em) {
    font-size: 14px;
  }

  align-items: center;
  text-align: right;

  & > * {
    font-size: 1em;
  }
`

const SORT_FIELD = {
  LIQ: 'totalLiquidityUSD',
  VOL: 'oneDayVolumeUSD',
  SYMBOL: 'symbol',
  NAME: 'name',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD'
}

// @TODO rework into virtualized list
function TopTokenList({ tokens }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)
  const [filteredItems, setFilteredItems] = useState()

  const [currency] = useCurrentCurrency()

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [tokens])

  useEffect(() => {
    if (tokens) {
      const tokensArray = []
      Object.keys(tokens).map(key => {
        tokens[key].address = key
        return tokensArray.push(tokens[key])
      })
      setFilteredItems(tokensArray)
      let extraPages = 1
      if (tokensArray.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(tokensArray.length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [tokens])

  const filteredList =
    filteredItems &&
    filteredItems
      .sort((a, b) => {
        if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
          return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)

  const ListItem = ({ item }) => {
    return (
      <DashGrid style={{ height: '60px' }}>
        <DataText area="name" fontWeight="500">
          <Row>
            <TokenLogo address={item.address} />
            <CustomLink
              style={{ marginLeft: '16px', whiteSpace: 'nowrap' }}
              to={'/token/' + item.address}
              onClick={() => {
                window.scrollTo(0, 0)
              }}
            >
              {item.name}
            </CustomLink>
          </Row>
        </DataText>
        <DataText area="symbol" color="text" fontWeight="500">
          {item.symbol}
        </DataText>
        <DataText area="price" color="text" fontWeight="500">
          {currency === 'ETH' ? 'Ξ ' + formattedNum(item.derivedETH) : formattedNum(item.priceUSD, true)}
        </DataText>
        <DataText area="liq">
          {currency === 'ETH'
            ? 'Ξ ' + formattedNum(item.totalLiquidityETH)
            : formattedNum(item.totalLiquidityUSD, true)}
        </DataText>
        <>
          <DataText area="vol">
            {currency === 'ETH'
              ? 'Ξ ' + formattedNum(item.oneDayVolumeETH, true)
              : formattedNum(item.oneDayVolumeUSD, true)}
          </DataText>
          <DataText area="change">
            {currency === 'ETH' ? formattedNum(item.priceChangeETH) : formattedNum(item.priceChangeUSD)}%
          </DataText>
        </>
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <DashGrid center={true} style={{ height: '60px' }}>
        <Flex alignItems="center" justifyContent="flexStart">
          <ClickableText
            color="text"
            area="name"
            fontWeight="500"
            onClick={e => {
              setSortedColumn(SORT_FIELD.NAME)
              setSortDirection(!sortDirection)
            }}
          >
            Name {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="symbol"
            onClick={e => {
              setSortedColumn(SORT_FIELD.SYMBOL)
              setSortDirection(!sortDirection)
            }}
          >
            Symbol {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="price"
            onClick={e => {
              setSortedColumn(SORT_FIELD.PRICE)
              setSortDirection(!sortDirection)
            }}
          >
            Price {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="liq"
            onClick={e => {
              setSortedColumn(SORT_FIELD.LIQ)
              setSortDirection(!sortDirection)
            }}
          >
            Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="vol"
            onClick={e => {
              setSortedColumn(SORT_FIELD.VOL)
              setSortDirection(!sortDirection)
            }}
          >
            Volume (24 Hour) {sortedColumn === SORT_FIELD.VOL ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="change"
            onClick={e => {
              setSortedColumn(SORT_FIELD.CHANGE)
              setSortDirection(!sortDirection)
            }}
          >
            Price Change (24 Hour) {sortedColumn === SORT_FIELD.CHANGE ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
      </DashGrid>
      <Divider />
      <List p={0}>
        {!filteredList ? (
          <LocalLoader />
        ) : (
          filteredList.map((item, index) => {
            return (
              <div key={index}>
                <ListItem key={index} index={index + 1} item={item} />
                <Divider />
              </div>
            )
          })
        )}
      </List>
      <PageButtons>
        <div
          onClick={e => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        {'Page ' + page + ' of ' + maxPage}
        <div
          onClick={e => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default TopTokenList
