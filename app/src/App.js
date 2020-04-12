import React, { useCallback } from 'react'
import { useGuiStyle, useAppState } from '@aragon/api-react'
import {
  Main,
  Button,
  SidePanel,
  SyncIndicator,
  IconPlus,
  Header,
  useLayout,
} from '@aragon/ui'

import ProposalDetail from './screens/ProposalDetail'
import Proposals from './screens/Proposals'
import AddProposalPanel from './components/AddProposalPanel'

import useAppLogic from './app-logic'
import useFilterProposals from './hooks/useFilterProposals'
import useSelectedProposal from './hooks/useSelectedProposal'

const App = React.memo(function App() {
  const {
    myStakes,
    myLastStake,
    setProposalPanel,
    proposalPanel,
    onProposalSubmit,
  } = useAppLogic()

  const { proposals = [], isSyncing, requestToken, stakeToken } = useAppState()

  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const [selectedProposal, selectProposal] = useSelectedProposal(proposals)
  const handleBack = useCallback(() => selectProposal(-1), [selectProposal])
  const {
    filteredProposals,
    proposalExecutionStatusFilter,
    proposalSupportStatusFilter,
    proposalTextFilter,
    handleProposalSupportFilterChange,
    handleProposalExecutionFilterChange,
    handleSearchTextFilterChange,
  } = useFilterProposals(proposals)

  const handleTabChange = tabIndex => {
    handleProposalExecutionFilterChange(tabIndex)
    handleProposalSupportFilterChange(-1)
  }

  return (
    <React.Fragment>
      <SyncIndicator visible={isSyncing} />
      <Header
        primary="Conviction Voting"
        secondary={
          !selectedProposal && (
            <Button
              mode="strong"
              onClick={() => setProposalPanel(true)}
              label="New proposal"
              icon={<IconPlus />}
              display={compactMode ? 'icon' : 'label'}
            />
          )
        }
      />
      {selectedProposal ? (
        <ProposalDetail
          proposal={selectedProposal}
          onBack={handleBack}
          requestToken={requestToken}
        />
      ) : (
        <Proposals
          proposals={proposals}
          selectProposal={selectProposal}
          filteredProposals={filteredProposals}
          proposalExecutionStatusFilter={proposalExecutionStatusFilter}
          proposalSupportStatusFilter={proposalSupportStatusFilter}
          proposalTextFilter={proposalTextFilter}
          handleProposalSupportFilterChange={handleProposalSupportFilterChange}
          handleExecutionStatusFilterChange={handleTabChange}
          handleSearchTextFilterChange={handleSearchTextFilterChange}
          requestToken={requestToken}
          stakeToken={stakeToken}
          myLastStake={myLastStake}
          myStakes={myStakes}
        />
      )}
      <SidePanel
        title="New proposal"
        opened={proposalPanel}
        onClose={() => setProposalPanel(false)}
      >
        <AddProposalPanel onSubmit={onProposalSubmit} />
      </SidePanel>
    </React.Fragment>
  )
})

export default () => {
  const { appearance } = useGuiStyle()
  return (
    <Main theme={appearance} assetsUrl="./aragon-ui">
      <App />
    </Main>
  )
}
