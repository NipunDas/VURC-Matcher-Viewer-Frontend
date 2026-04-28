import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { BoxcastPlayer } from './BoxcastPlayer'

export type BroadcastInfo = {
  division: string
  day: number
}

const BROADCAST_INFORMATION: Record<string, BroadcastInfo> = {
  sw2mewknkrowugketxyt: {
    division: 'Research',
    day: 1,
  },
  zhfds2dg0kjvu34lr9lp: {
    division: 'Design',
    day: 1,
  },
  mtigshjyhxb963trskgz: {
    division: 'Opportunity',
    day: 1,
  },
  yey914lnyxu0gx5cqeie: {
    division: 'Research',
    day: 2,
  },
  hxc5w7atoykkayrkatw0: {
    division: 'Design',
    day: 2,
  },
  ug7er6jf6u9ili88snjz: {
    division: 'Opportunity',
    day: 2,
  },
  knie7vj3zz06vgenh9uh: {
    division: 'Research',
    day: 3,
  },
  t0lb3eqnzxs5fue6cmb0: {
    division: 'Design',
    day: 3,
  },
  nobkkjkvjsjvbixcbmy1: {
    division: 'Opportunity',
    day: 3,
  },
  ws7r77j055jn9nbchhxv: {
    division: 'VEX U',
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
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component='img'
            src='/vex_logo.svg'
            alt='VEX logo'
            sx={{
              height: { xs: 40, sm: 60 },
              width: 'auto',
            }}
          />

          <Box
            component='img'
            src='/cpslo.png'
            alt='CPSLO logo'
            sx={{
              height: { xs: 40, sm: 60 },
              width: 'auto',
            }}
          />
        </Box>

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

        <Box sx={{ width: '100%' }}>
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
