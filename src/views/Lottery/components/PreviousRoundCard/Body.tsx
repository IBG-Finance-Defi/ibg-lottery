import React from 'react'
import styled from 'styled-components'
import {
  CardBody,
  Heading,
  Flex,
  Skeleton,
  Text,
  Box,
  Button,
  useModal,
  CardRibbon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { LotteryRound } from 'state/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 72px;
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
    margin-left: 1rem;
  }
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`
const W1 = styled(Heading)`
  ${({ theme }) => theme.mediaQueries.sm} {
  }
`
const W2 = styled(Heading)`
  margin: 0rem;
  ${({ theme }) => theme.mediaQueries.sm} {
  }
`

const Mobile = styled.div`
  display: block;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`
const PC = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`
const Flexu = styled(Flex)`
  flex-direction: column;
  height: auto;
  margin-top: 4rem;
  align-items: center;
  justify-content: space-evenly;
  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-around;
    height: 10rem;
    margin-top: 3rem;
  }
`

const PreviousRoundCardBody: React.FC<{ lotteryNodeData: any; lotteryId: string }> = ({
  lotteryNodeData,
  lotteryId,
}) => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl

  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId

  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryNodeData?.status} />,
  )

  const totalTicketNumber = userDataForRound ? userDataForRound.totalTickets : 0
  const ticketRoundText =
    totalTicketNumber > 1
      ? t('You had %amount% tickets this round', { amount: totalTicketNumber })
      : t('You had %amount% ticket this round', { amount: totalTicketNumber })
  const [youHadText, ticketsThisRoundText] = ticketRoundText.split(totalTicketNumber.toString())

  return (
    <StyledCardBody>
      {isLatestRound && <StyledCardRibbon text={t('Latest')} />}
      <Flexu flexDirection="column">
        <PC>
          <W1 mb="10px">
            {t('Winner_#1')} {lotteryNodeData?.firstWinner}
          </W1>
        </PC>
        <Mobile>
          <W1 mb="10px">
            {t('#1')} {lotteryNodeData?.firstWinner}
          </W1>
        </Mobile>
        <PC>
          <W2 mb="10px">
            {t('Winner_#2')} {lotteryNodeData?.secondWinner}
          </W2>
        </PC>
        <Mobile>
          <W1 mb="10px">
            {t('#2')}
            {lotteryNodeData?.secondWinner}{' '}
          </W1>
        </Mobile>



        <PC>
          <W2 mb="10px" color="red">
           Total Participants {lotteryNodeData?.numOfParticipants}
          </W2>
        </PC>
        <Mobile>
          <W1 mb="10px">
          Total Participants {lotteryNodeData?.numOfParticipants}

          </W1>
        </Mobile>



        <PC>
          <W2 mb="10px" color="red">
           Total Sales {lotteryNodeData?.sales}
          </W2>
        </PC>
        <Mobile>
          <W1 mb="10px">
          Total Sales {lotteryNodeData?.sales}

          </W1>
        </Mobile>



        <PC>
          <W2 mb="10px" color="red">
           Total Tickets {lotteryNodeData?.totalTickets}
          </W2>
        </PC>
        <Mobile>
          <W1 mb="10px">
          Total Tickets {lotteryNodeData?.totalTickets}

          </W1>
        </Mobile>



      
      </Flexu>
      <Grid>
        {/* <Flex justifyContent={['center', null, null, 'flex-start']}> */}

        {/* </Flex> */}
        <Flex maxWidth={['240px', null, null, '100%']} >
          {/*           
        <PC><W1  mb="24px">{t('Winner_#1')} {lotteryNodeData?.firstWinner}</W1></PC><Mobile><W1  mb="24px">{t('#1')} {lotteryNodeData?.firstWinner}</W1></Mobile>
        <PC><W2  mb="24px">{t('Winner_#2')} {lotteryNodeData?.secondWinner}</W2></PC><Mobile><W1  mb="24px">{t('#2')}{lotteryNodeData?.secondWinner} </W1></Mobile> */}

          {/* {lotteryNodeData ? (
            <div>
              <Heading style={{textAlign:"center"}} mb="24px">{t('Winners')}</Heading>
              <WinningNumbers
                rotateText={isLargerScreen || false}
                number={lotteryNodeData?.finalNumber.toString()}
                mr={[null, null, null, '32px']}
                size="100%"
                fontSize={isLargerScreen ? '42px' : '16px'}
              />
              <br />
              <WinningNumbers
              rotateText={isLargerScreen || false}
              number={lotteryNodeData?.finalNumber.toString()}
              mr={[null, null, null, '32px']}
              size="100%"
              fontSize={isLargerScreen ? '42px' : '16px'}
            />
            </div>

          ) : (
            <Skeleton
              width={['240px', null, null, '450px']}
              height={['34px', null, null, '71px']}
              mr={[null, null, null, '32px']}
            />
          )} */}
        </Flex>
      </Grid>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
