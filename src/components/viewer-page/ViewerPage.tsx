import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { BoxcastPlayer } from './BoxcastPlayer'

export type BroadcastInfo = {
  division: string
  day: number
}

const BROADCAST_INFORMATION: Record<string, BroadcastInfo> = {
  fi5auivq6h7l6nxazhsu: {
    division: 'Math',
    day: 1,
  },
  cbj373thpcftjrm5h3i2: {
    division: 'Math',
    day: 2,
  },
  ut5mdvnqhcacoxk5kl31: {
    division: 'Math',
    day: 3,
  },
  ckddixroqg1uhb6rpvsd: {
    division: 'Technology',
    day: 1,
  },
  rvwjpnlfvhr5qlv0wjjk: {
    division: 'Technology',
    day: 2,
  },
  wu1onfpso9uzyeq4vusp: {
    division: 'Technology',
    day: 3,
  },
}

export const ViewerPage: React.FunctionComponent = () => {
  const [searchParams] = useSearchParams()
  const broadcastId = searchParams.get('broadcastId')

  const broadcastInfo = broadcastId
    ? BROADCAST_INFORMATION[broadcastId]
    : undefined

  const headerText = broadcastInfo
    ? `${broadcastInfo.division} Division - Day ${broadcastInfo.day}`
    : 'Broadcast'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box
          component='img'
          src='/vex_logo.svg'
          alt='VEX logo'
          sx={{
            width: '100%',
            maxWidth: 220,
            height: 'auto',
          }}
        />

        <Typography
          variant='h4'
          component='h1'
          sx={{
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          {headerText}
        </Typography>

        <Box
          sx={{
            width: '100%',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              backgroundColor: 'black',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
              }}
            >
              <BoxcastPlayer />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
