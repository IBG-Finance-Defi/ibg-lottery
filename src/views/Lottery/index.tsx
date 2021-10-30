import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import {
  TITLE_BG,
  GET_TICKETS_BG,
  FINISHED_ROUNDS_BG,
  FINISHED_ROUNDS_BG_DARK,
  CHECK_PRIZES_BG,
} from './pageSectionStyles'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import NextDrawCard from './components/NextDrawCard'
import Countdown from './components/Countdown'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import HowToPlay from './components/HowToPlay'
import useShowMoreUserHistory from './hooks/useShowMoreUserRounds'

const LotteryPage = styled.div`
  // min-height: calc(100vh - 64px);
  height:100vh; to min-height:100vh
`

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  
  const { isDark, theme } = useTheme()
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const { numUserRoundsRequested, handleShowMoreUserRounds } = useShowMoreUserHistory()
  const [previousRound, setPreviousRound] = useState([])

  return (
    <LotteryPage style={{ background: '#fff' }}>
    
      <PageSection
        containerProps={{ style: { marginTop: '-30px' } }}
        background={GET_TICKETS_BG}
        concaveDivider
        clipFill={{ light: '#9e10ea' }}
        dividerPosition="top"
        index={2}
        style={{ background: 'linear-gradient(to bottom, #7E41D6, #59179E)' }}
      >
        <Flex alignItems="center" justifyContent="center" flexDirection="column" pt="24px">
         
          <Heading scale="xl" color="#fff" mb="24px" textAlign="center">
            {t('Get your tickets now!')}
          </Heading>

          <NextDrawCard onPreviousRounds={(rounds)=>{
            setPreviousRound(rounds)
          }} />
        </Flex>
      </PageSection>
      
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG}
        hasCurvedDivider={false}
        index={2}
        style={{ background: 'linear-gradient(to bottom, #83a4d4, #b6fbff)' }}
      >
        <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
          <Heading color="#03025f" mb="24px" scale="xl">
            {t('Last 3 Finished Rounds')}
          </Heading>
          

          <AllHistoryCard  rounds={previousRound}/>
        </Flex>
      </PageSection>
      <PageSection
        dividerPosition="top"
        dividerFill={{ light: theme.colors.background }}
        clipFill={{ light: '#fff', dark: '#66578D' }}
        index={2}
      >
         <HowToPlay />
      </PageSection>
    </LotteryPage>
  )
}

export default Lottery
