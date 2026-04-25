import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MatchesPage } from './components/matches-page/MatchesPage'
import { ViewerPage } from './components/viewer-page/ViewerPage'

export const App: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route path='/' element={<MatchesPage />}/>
      <Route path='/broadcast' element={<ViewerPage />} />
    </Routes>
  )
}
