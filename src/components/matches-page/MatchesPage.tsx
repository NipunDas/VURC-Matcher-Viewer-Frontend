import { Box } from '@mui/material'
import React from 'react'
import { MatchesTable } from './MatchesTable'

export const MatchesPage: React.FunctionComponent = () => (
  <Box
    sx={{
      width: '100%',
      px: 3,
      py: 3,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 3,
      }}
    >
      <Box
        component='img'
        src='/vex_logo.svg'
        alt='Vex Logo'
        sx={{
          maxWidth: 240,
          width: '100%',
          height: 'auto',
        }}
      />
    </Box>

    <MatchesTable />
  </Box>
)
