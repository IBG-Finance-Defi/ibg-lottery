import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { BIG_ZERO, ethersToBigNumber } from 'utils/bigNumber'
import useAuth from 'hooks/useAuth'

import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  useWalletModal,
  Text,
  Skeleton,
  Button,
  useModal,
  Box,
  CardFooter,
  ExpandableLabel,
} from '@pancakeswap/uikit'
import { useCake, useLotteryV2Contract ,useERC20} from 'hooks/useContract'

import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import ViewTicketsModal from './ViewTicketsModal'
import BuyTicketsButton from './BuyTicketsButton'
import { dateTimeOptions } from '../helpers'
import RewardBrackets from './RewardBrackets'

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const StepContainer = styled(Flex)`
  gap: 24px;
  margin-top: 24px;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  // background-color: #fef0ff;
  // padding: 1rem;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: baseline;
  position: relative;
  background: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  border-radius: ${({ theme }) => theme.radii.card};
`
const StepCardInner = styled(Box)`
  width: 100%;
  padding: 24px;
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
`
const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 520px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 1200px;
  }
`

const NextDrawWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const H = styled.h2`
  color: #000080;
  font-weight: 550;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  @media only screen and (max-width: 600px) {
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center;
  }
`

const T = styled.p`
  color: #000080;
  font-weight: regular;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  @media only screen and (max-width: 600px) {
    font-weight: regular;
    font-size: 1rem;
  }
`

const Left = styled.div`
  display: grid;
  place-items: center;
  @media only screen and (max-width: 600px) {
  }
`

const Right = styled.div`
  display: grid;
  place-items: center;
  @media only screen and (max-width: 600px) {
    margin-top: 1.5rem;
  }
`

const Flexx = styled(Flex)`
  width: 100%;
  align-items: center;
  justify-content: space-around;
  background-color: rgb(248, 239, 242);
  border-radius: 0.5rem;
  padding: 1rem;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const Foot = styled(CardFooter)`
  display: grid;
  place-items: center;
  padding: 1rem;
`

const NextDrawCard = (props) => {
  const { account } = useWeb3React()
  const { currentLotteryId, isTransitioning, currentRound } = useLottery()

  const lotteryContract = useLotteryV2Contract()

  const { endTime, amountCollectedInCake, userTickets, status } = currentRound

  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)
  const [isExpanded, setIsExpanded] = useState(false)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount = userTickets?.tickets?.length || 0
  const [myTicketsInCurrentRound, setMyTicketsInCurrentRound] = useState(0)

  const [totalParticipants, setTotalParticipants] = useState(0)
  const [ticketsSold, setTicketsSold] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const [eligibleForFeeTicket, setEligibleForFeeTicket] = useState(false)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApprovalRequired,setApprovalRequired] = useState(true)
  const tokenContract = useERC20("0x5c46c55a699a6359e451b2c99344138420c87261");
  const { t } = useTranslation()


  const getPrizeBalances = () => {
    if (status === LotteryStatus.CLOSE || status === LotteryStatus.CLAIMABLE) {
      return (
        <Heading scale="xl" color="secondary" textAlign={['center', null, null, 'left']}>
          {t('Calculating')}...
        </Heading>
      )
    }
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <Balance
            fontSize="40px"
            color="#7f09c4"
            textAlign={['center', null, null, 'left']}
            lineHeight="1"
            bold
            prefix="~$"
            value={getBalanceNumber(prizeInBusd)}
            decimals={0}
          />
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="#7f09c4"
            textAlign={['center', null, null, 'left']}
            unit="IBG"
            value={getBalanceNumber(amountCollectedInCake)}
            decimals={0}
          />
        )}
      </>
    )
  }

  const claimTicket = async () => {
    return callWithGasPrice(lotteryContract, 'claimTicket', [])

    // await lotteryContract.claimTicket()
  }

  const { login, logout } = useAuth()

  const handleTicketBuy = async (numberOfTickets) => {
    return callWithGasPrice(lotteryContract, 'purchaseTicket', [numberOfTickets])

    // await lotteryContract.claimTicket()
  }

  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  const handleApproval = async()=>{

    return callWithGasPrice(tokenContract, 'approve', [getLotteryV2Address(), ethers.constants.MaxUint256])
  }
  const renderBuyOfApprovalButton = (noOfTickets)=>{

    
    if(!account){
      return <Button
      maxWidth="280px"
      onClick={() => {
        onPresentConnectModal()
      }}
      style={{ background: 'red', marginTop: '0.5rem' }}
    >
      Connect Wallet
    </Button>
    }
    if(isApprovalRequired){
      return <Button
      maxWidth="280px"
      onClick={() => {
        handleApproval()
      }}
      style={{ background: 'red', marginTop: '0.5rem' }}
    >
      Approve Contract
    </Button>
    }
    return  <Button
    maxWidth="280px"
    onClick={() => {
      handleTicketBuy(noOfTickets)
    }}
    style={{ background: 'red', marginTop: '0.5rem' }}
  >
    Buy
  </Button>
  }



  const getNextDrawId = () => {
    if (status === LotteryStatus.OPEN) {
      return `${currentLotteryId} |`
    }
    if (status === LotteryStatus.PENDING) {
      return ''
    }
    return parseInt(currentLotteryId, 10) + 1
  }

  const getNextDrawDateTime = () => {
    if (status === LotteryStatus.OPEN) {
      return `${t('Draw')}: ${endDate.toLocaleString(undefined, dateTimeOptions)}`
    }
    return ''
  }

  const ticketRoundText =
    userTicketCount > 1
      ? t('You have %amount% tickets this round', { amount: userTicketCount })
      : t('You have %amount% ticket this round', { amount: userTicketCount })

  const [youHaveText, ticketsThisRoundText] = ticketRoundText.split(userTicketCount.toString())

  const loadContractData = useCallback(async () => {
    if (!lotteryContract || !tokenContract) {
      return
    }


    let _currentRound =await lotteryContract.getCurrentRound();
    _currentRound = _currentRound.toNumber()


    

    const currentStats = await lotteryContract.getStats(_currentRound)

    setTicketsSold(currentStats._numTotalTickets.toNumber())
    setTotalParticipants(currentStats._numParticipants.toNumber())
    
    setTotalSales(getBalanceNumber(new BigNumber(currentStats._sales._hex)))

    if (account) {
      const _isEliglibleForFreeTickets = await lotteryContract.isEligibleForFeeTickets(account)
      setEligibleForFeeTicket(_isEliglibleForFreeTickets)
      const approval = (await tokenContract.allowance(account,getLotteryV2Address()))

      const currentAllowance = ethersToBigNumber(approval)





      const myTicketsInThisRound = await lotteryContract.numTicketsOf(_currentRound,account)

      console.log("myTicketsInThisRound",myTicketsInThisRound)
      setMyTicketsInCurrentRound(new BigNumber(myTicketsInThisRound._hex).toNumber())
     
     
      setApprovalRequired(!currentAllowance.gt(0));

    }



    if((_currentRound-1)> 0){
      const previousRounds = []
      /* eslint-disable no-await-in-loop */
     
      for(let i = _currentRound-1;i>= _currentRound-3;i--){
        const stats = await lotteryContract.getStats(i);
        const preTotalTickets = stats._numTotalTickets.toNumber();
        const preSales = getBalanceNumber(new BigNumber(stats._sales._hex))
        const preNumOfParticipants = stats._numParticipants.toNumber();
        const pre1stWinner = stats._firstWinner
        const pre2ndWinner = stats._secondWinner

        previousRounds.push({
          roundNumber:i,
          totalTickets:preTotalTickets,
          sales:preSales,
          numOfParticipants:preNumOfParticipants,
          firstWinner:pre1stWinner,
          secondWinner:pre2ndWinner
        })
      }

      props.onPreviousRounds(previousRounds);
    }


  }, [lotteryContract, account,tokenContract,props])

  useEffect(() => {
    if (lotteryContract) {
      // setInterval(()=>{
      //   loadContractData()
      // },5000)
      loadContractData()

    }

  }, [lotteryContract, loadContractData])

  return (
    <StyledCard>
      <CardHeader p="16px 24px" style={{ background: '#f8eff2' }}>
        <Flex justifyContent="space-between">
          <Heading mr="12px">{t('Next Draw')}</Heading>
          <Text>
            {currentLotteryId && `#${getNextDrawId()}`} {Boolean(endTime) && getNextDrawDateTime()}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        {/* <Grid>
          <Flex justifyContent={['center', null, null, 'flex-start']}>
            <Heading>{t('Prize Pot')}</Heading>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            {getPrizeBalances()}
          </Flex>
          <Box display={['none', null, null, 'flex']}>
            <Heading>{t('Your tickets')}</Heading>
          </Box>
          <Flex flexDirection={['column', null, null, 'row']} alignItems={['center', null, null, 'flex-start']}>
            {isLotteryOpen && (
              <Flex
                flexDirection="column"
                mr={[null, null, null, '24px']}
                alignItems={['center', null, null, 'flex-start']}
              >
                {account && (
                  <Flex justifyContent={['center', null, null, 'flex-start']}>
                    <Text display="inline">{youHaveText} </Text>
                    {!userTickets.isLoading ? (
                      <Balance value={userTicketCount} decimals={0} display="inline" bold mx="4px" />
                    ) : (
                      <Skeleton mx="4px" height={20} width={40} />
                    )}
                    <Text display="inline"> {ticketsThisRoundText}</Text>
                  </Flex>
                )}
                {!userTickets.isLoading && userTicketCount > 0 && (
                  <Button
                    onClick={onPresentViewTicketsModal}
                    height="auto"
                    width="fit-content"
                    p="0"
                    mb={['32px', null, null, '0']}
                    variant="text"
                    scale="sm"
                    style={{ color: "red" }}
                  >
                    {t('View your tickets')}
                  </Button>
                )}
              </Flex>
            )}
            <BuyTicketsButton disabled={ticketBuyIsDisabled} maxWidth="280px" />
          </Flex>

        </Grid> */}

        <Flexx>
          <Left>
            <H>Prizes</H>
            <Flex>
              <T>Winner 1:</T>
              <T style={{ marginLeft: '1rem' }}>25000 iBG</T>
            </Flex>
            <Flex>
              <T>Winner 2:</T>
              <T style={{ marginLeft: '0.8rem' }}>25000 iBG</T>
            </Flex>
          </Left>
          <Right>
            <H>Current Lottery Information</H>
            <Flex>
              <T>Ticket Solds:</T>
              <T style={{marginLeft:2}}>{ticketsSold} Tickets</T>
            </Flex> 
            <Flex>
              <T>Sales proceeds: </T>
              <T style={{marginLeft:2}}>{totalSales} IBG</T>
            </Flex>
            <Flex>
              <T style={{ textAlign: 'center' }}>Number of Participants: {totalParticipants} Participants</T>
            </Flex>


            <Flex>
              <T style={{ textAlign: 'center' }}>My Tickets in this Round: {myTicketsInCurrentRound} Tickets</T>
            </Flex>

            
          </Right>
        </Flexx>

        <StepContainer>
          <Card style={{ minWidth: '250px' }}>
            <CardHeader style={{ background: 'red', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Buy 1 Ticket
            </CardHeader>
            <CardBody style={{ textAlign: 'center', background: 'rgb(248, 239, 242)' }}>
              <Text>5 IBG</Text>

              {renderBuyOfApprovalButton(1)}
            </CardBody>
          </Card>

          <Card style={{ minWidth: '250px' }}>
            <CardHeader style={{ background: 'red', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Buy 10 Tickets
            </CardHeader>
            <CardBody style={{ textAlign: 'center', background: 'rgb(248, 239, 242)' }}>
              <Text>47.5 IBG</Text>
              {renderBuyOfApprovalButton(10)}

            </CardBody>
          </Card>

          <Card style={{ minWidth: '250px' }}>
            <CardHeader style={{ background: 'red', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Buy 100 Tickets
            </CardHeader>
            <CardBody style={{ textAlign: 'center', background: 'rgb(248, 239, 242)' }}>
              <Text>450 IBG</Text>
              {renderBuyOfApprovalButton(100)}

            </CardBody>
          </Card>
          <Card style={{ minWidth: '250px' }}>
            <CardHeader style={{ background: 'red', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Buy 1000 Tickets
            </CardHeader>
            <CardBody style={{ textAlign: 'center', background: 'rgb(248, 239, 242)' }}>
              <Text>4000 IBG</Text>
              {renderBuyOfApprovalButton(1000)}

            </CardBody>
          </Card>
        </StepContainer>
      </CardBody>
      <Foot p="0">
        <Text>Claim free ticket only for SuperStakers, 1 ticket per 1,000 iBG staked in the SuperStaking pools</Text>
        <Button
          style={{ marginTop: '0.5rem' }}
          disabled={!eligibleForFeeTicket}
          onClick={() => {
            claimTicket()
          }}
        >
          {eligibleForFeeTicket ? 'Claim' : 'No Free Tickets Available'}
        </Button>
      </Foot>
    </StyledCard>
  )
}

export default NextDrawCard
