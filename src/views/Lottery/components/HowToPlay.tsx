import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, Heading, useMatchBreakpoints, Link, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { BallWithNumber, MatchExampleA, MatchExampleB, PoolAllocationChart } from '../svgs'

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 40px 0;
  width: 100%;
`

const BulletList = styled.ul`
  list-style-type: none;
  margin-left: 8px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::before {
    content: '•';
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  li::marker {
    font-size: 12px;
  }
`

const StepContainer = styled(Flex)`
  gap: 24px;
  width: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  min-height: 18rem;
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

type Step = { title: string; subtitle: string; label: string }

const StepCard: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <StyledStepCard width="100%">
      <StepCardInner>
        <Text mb="16px" fontSize="12px" bold textAlign="right" textTransform="uppercase">
          {step.label}
        </Text>
        <Heading mb="16px" scale="lg" color="red">
          {step.title}
        </Heading>
        <Text >{step.subtitle}</Text>
      </StepCardInner>
    </StyledStepCard>
  )
}

const BallsContainer = styled(Flex)`
  gap: 6.5px;
  padding-left: 7px;
  align-items: center;
  width: 100%;
`

const InlineLink = styled(Link)`
  display: inline;
`

const ExampleBalls = () => {
  const { isDesktop } = useMatchBreakpoints()
  const ballSize = isDesktop ? '24px' : '32px'
  const fontSize = isDesktop ? '14px' : '16px'
  return (
    <BallsContainer>
      <BallWithNumber size={ballSize} fontSize={fontSize} color="yellow" number="9" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="green" number="1" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="aqua" number="3" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="teal" number="6" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="lilac" number="6" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="pink" number="2" />
    </BallsContainer>
  )
}

const MatchExampleContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 46px 64px 64px;
`

const MatchExampleCard = () => {
  const { isDark } = useTheme()
  const { isXs } = useMatchBreakpoints()
  const { t } = useTranslation()
  const exampleWidth = isXs ? '210px' : '258px'
  return (
    <StyledStepCard width={['280px', '330px', '380px']}>
      <StepCardInner height="220px">
        <MatchExampleContainer>
          <Box />
          <ExampleBalls />
          <Text lineHeight="72px" textAlign="right" color="secondary" bold mr="20px">
            {t('A')}
          </Text>
          <MatchExampleA width={exampleWidth} height="46px" isDark={isDark} />
          <Text lineHeight="72px" textAlign="right" color="secondary" bold mr="20px">
            {t('B')}
          </Text>
          <MatchExampleB width={exampleWidth} height="46px" isDark={isDark} />
        </MatchExampleContainer>
      </StepCardInner>
    </StyledStepCard>
  )
}

const AllocationGrid = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-auto-rows: max-content;
  row-gap: 4px;
`

const AllocationColorCircle = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-color: ${({ color }) => color};
`

const Div = styled.div`
  margin-top: 2rem;
  text-align: center;
`

const AllocationMatch: React.FC<{ color: string; text: string }> = ({ color, text }) => {
  return (
    <Flex alignItems="center">
      <AllocationColorCircle color={color} />
      <Text color="textSubtle">{text}</Text>
    </Flex>
  )
}

const PoolAllocations = () => {
  const { t } = useTranslation()
  return (
    <StyledStepCard width={['280px', '330px', '380px']}>
      <StepCardInner height="auto">
        <Flex mb="32px" justifyContent="center">
          <PoolAllocationChart width="100px" height="100px" />
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
            {t('Digits matched')}
          </Text>
          <Text fontSize="12px" color="secondary" bold textAlign="right" textTransform="uppercase">
            {t('Prize pool allocation')}
          </Text>
        </Flex>
        <AllocationGrid>
          <AllocationMatch color="#FFE362" text={t('Matches first %digits%', { digits: 1 })} />
          <Text textAlign="right" bold>
            2%
          </Text>
          <AllocationMatch color="#85C54E" text={t('Matches first %digits%', { digits: 2 })} />
          <Text textAlign="right" bold>
            3%
          </Text>
          <AllocationMatch color="#028E75" text={t('Matches first %digits%', { digits: 3 })} />
          <Text textAlign="right" bold>
            5%
          </Text>
          <AllocationMatch color="#36E8F5" text={t('Matches first %digits%', { digits: 4 })} />
          <Text textAlign="right" bold>
            10%
          </Text>
          <AllocationMatch color="#A881FC" text={t('Matches first %digits%', { digits: 5 })} />
          <Text textAlign="right" bold>
            20%
          </Text>
          <AllocationMatch color="#D750B2" text={t('Matches all 6')} />
          <Text textAlign="right" bold>
            40%
          </Text>
          <AllocationMatch color="#BDC2C4" text={t('Burn Pool')} />
          <Text textAlign="right" bold>
            20%
          </Text>
        </AllocationGrid>
      </StepCardInner>
    </StyledStepCard>
  )
}

const GappedFlex = styled(Flex)`
  gap: 24px;
`

const HowToPlay: React.FC = () => {
  const { t } = useTranslation()

  const steps: Step[] = [
    {
      label: t('Step %number%', { number: 1 }),
      title: t('Buy Tickets'),
      subtitle: t('Buy a standard lottery ticket for 5 iBGs. Enjoy discount with bulk purchase. (Superstakers can claim 1 free ticket for every 1000 iBG tokens superstaked) '),
    },
    {
      label: t('Step %number%', { number: 2 }),
      title: t('Wait for the Draw'),
      subtitle: t('There will be one drawndown every sunday 7pm GMT +B'),
    },
    {
      label: t('Step %number%', { number: 3 }),
      title: t('Winner Announcement'),
      subtitle: t('After each drawndown, Winner will be automatically dropped prize tokens and announced in the dashboard'),
    },
    {
      label: t('Step %number%', { number: 4 }),
      title: t('Repeat'),
      subtitle: t('The smart contract automatically resets and restarts next draw and repeats 1-3 without intervention'),
    },
  ]
  return (
    <Box width="100%">


<GappedFlex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="2" style={{textAlign:"center"}} flexDirection="column" justifyContent="center">
          <Heading mb="36px" scale="xl" color="red">
            {t('About iBG Lottery')}
          </Heading>
          {/* <Heading mb="24px" scale="md">
            {t('The digits on your ticket must match in the correct order to win.')}
          </Heading> */}
          <Text mb="6px" >
          This is an exclusive lottery for BSC only.
                    </Text>
          {/* <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'Ticket A: The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only wins a “Match first 3” prize.',
                )}
              </Text>
            </li>
            <li>
              <Text display="inlbackground: #7E41D6;
background: -webkit-linear-gradient(top, #7E41D6, #59179E);
background: -moz-linear-gradient(top, #7E41D6, #59179E);
background: linear-gradient(to bottom, #7E41D6, #59179E);ine" color="textSubtle">
                {t(
                  'Ticket B: Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a prize.',
                )}
              </Text>
            </li>
          </BulletList> */}
          <Text mt="16px"  >
            
             Lottery cycle starts every Sunday at 7pm.
            
          </Text>
          <Text mt="16px" >
          <span style={{color:"red"}}>2 Winners</span> The drawndown of winners will be every Sunday 7pm GMT+8
            
          </Text>
          <Text mt="16px" >
           
          <span style={{color:"red"}}>10,000 iBG Prize.</span> Each winner randomly picked via smart contract logic and will win 5,000 iBG each
           
          </Text>
          <Text mt="16px" >
          The lottery is fully managed by a smart contract that allows anyone check to the address.
          </Text>
          <Text mt="16px" >
            {t(
              '100% of subscription proceeds burned (no fees to the company nor the developer) '
            )}
          </Text>
        </Flex>
        {/* <Flex flex="1" justifyContent="center">
          <MatchExampleCard />
        </Flex> */}
      </GappedFlex>

      <Divider />

      <Flex mb="40px" alignItems="center" flexDirection="column">
        <Heading mb="24px" scale="xl" color="red">
          {t('How it works')}
        </Heading>
        {/* <Text textAlign="center">
          {t(
            'If the digits on your tickets match the winning numbers in the correct order, you win a portion of the prize pool.',
          )}
        </Text> */}
        {/* <Text>{t('Simple!')}</Text> */}
      </Flex>
      <StepContainer>
        {steps.map((step) => (
          <StepCard key={step.label} step={step} />
        ))}
      </StepContainer>
      
      <Div>
      <Heading mb="18px" style={{marginTop:"2rem"}} scale="xl" color="red" >Standing together as united ecosystem</Heading>
      <Text>All proceeeds are burned immediately upon purchase of tickets (No developer fees kept)</Text>
      <Text>Prize Tokens from the redistribution of a part of the non native farms yield. (This will benefits our whole ecosystem by bringing more holders and </Text>
        <Text>decrease the daily sell pressure of non native farmers</Text>
      </Div>
      {/* <Divider />
      <GappedFlex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="2" flexDirection="column">
          <Heading mb="24px" scale="lg" color="secondary">
            {t('Prize Funds')}
          </Heading>
          <Text color="textSubtle">{t('The prizes for each lottery round come from three sources:')}</Text>
          <Heading my="16px" scale="md">
            {t('Ticket Purchases')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('100% of the IBG paid by people buying tickets that round goes back into the prize pools.')}
              </Text>
            </li>
          </BulletList>
          <Heading my="16px" scale="md">
            {t('Rollover Prizes')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'After every round, if nobody wins in one of the prize brackets, the unclaimed IBG for that bracket rolls over into the next round and are redistributed among the prize pools.',
                )}
              </Text>
            </li>
          </BulletList>
          <Heading my="16px" scale="md">
            {t('IBG Injections')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'An average total of 35,000 IBG from the treasury is added to lottery rounds over the course of a week. This IBG is of course also included in rollovers! Read more in our guide to ',
                )}
                <InlineLink href="">
                  {t('IBG Tokenomics')}
                </InlineLink>
              </Text>
            </li>
          </BulletList>
        </Flex>
        <Flex flex="1" justifyContent="center">
          <PoolAllocations />
        </Flex>
      </GappedFlex>
      <Divider />
      <Flex justifyContent="center" alignItems="center" flexDirection={['column', 'column', 'row']}>
        <Image width={340} height={240} src="/images/logoBig.png" alt="tombola bunny" mr="8px" mb="16px" />
        <Flex maxWidth="300px" flexDirection="column">
          <Heading mb="16px" scale="md">
            {t('Still got questions?')}
          </Heading>
          <Text>
            {t('Check our in-depth guide on')}{' '}
            <InlineLink href="">
              {t('how to play the Zillionaire lottery!')}
            </InlineLink>
          </Text>
        </Flex>
      </Flex> */}
    </Box>
  )
}

export default HowToPlay
