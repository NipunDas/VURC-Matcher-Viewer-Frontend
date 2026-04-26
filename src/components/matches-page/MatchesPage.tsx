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
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Box
        component='img'
        src='/vex_logo.svg'
        alt='VEX Logo'
        sx={{
          height: { xs: 40, sm: 60 },
          width: 'auto',
        }}
      />

      <Box
        component='img'
        src='/cpslo.png'
        alt='CPSLO Logo'
        sx={{
          height: { xs: 40, sm: 60 },
          width: 'auto',
        }}
      />
    </Box>

    <MatchesTable />
  </Box>
)
