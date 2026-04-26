import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, createSearchParams } from 'react-router-dom'

export type Match = {
  match_id: string
  division_name: string
  blue_team: string
  blue_score: number
  red_team: string
  red_score: number
  timestamp: number
  channel_id: string
  broadcast_id: string
}

export type Division = 'Research' | 'Design' | 'Opportunity'

const MATCHES_JSON_FILE = '/RE-VURC-24-8911.json'
const DIVISIONS: Division[] = ['Research', 'Design', 'Opportunity']

const convertMatchIdToName = (matchId: string): string => {
  if (matchId.startsWith('PRACTICE')) {
    return `PRACTICE ${matchId.slice(8)}`
  } else if (matchId.startsWith('QUAL')) {
    return `QUAL ${matchId.slice(4)}`
  } else if (matchId.startsWith('R16')) {
    return `R16 #${matchId.slice(3)}`
  } else if (matchId.startsWith('QF')) {
    return `QF #${matchId.slice(2)}`
  } else if (matchId.startsWith('SF')) {
    return `SF #${matchId.slice(2)}`
  } else if (matchId.startsWith('FINALS')) {
    return `FINALS ${matchId.slice(6)}`
  } else {
    return matchId
  }
}

export const MatchesTable: React.FunctionComponent = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [teamQuery, setTeamQuery] = useState('')
  const [division, setDivision] = useState<Division>('Research')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    fetch(MATCHES_JSON_FILE)
      .then((res) => res.json())
      .then((data) => setMatches(data as Match[]))
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleDivisionChange = (e: SelectChangeEvent<Division>) => {
    setDivision(e.target.value as Division)
  }

  const filteredMatches = useMemo(() => {
    const processedTeamQuery = teamQuery.trim().toUpperCase()

    return matches.filter((match) => {
      const matchesDivision = match.division_name === division
      const matchesTeam =
        processedTeamQuery === '' ||
        match.red_team.toUpperCase().startsWith(processedTeamQuery) ||
        match.blue_team.toUpperCase().startsWith(processedTeamQuery)

      return matchesDivision && matchesTeam
    })
  }, [matches, teamQuery, division])

  const columnDefinitions: GridColDef[] = useMemo(
    () => [
      {
        field: 'match_id',
        headerName: 'Match',
        width: isMobile ? 92 : 130,
        minWidth: isMobile ? 92 : 120,
      },
      {
        field: 'red_team',
        headerName: isMobile ? 'Red' : 'Red Team',
        flex: 1,
        minWidth: isMobile ? 105 : 150,
      },
      {
        field: 'red_score',
        headerName: isMobile ? 'R' : 'Red Score',
        width: isMobile ? 56 : 110,
        minWidth: isMobile ? 56 : 110,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
      },
      {
        field: 'blue_team',
        headerName: isMobile ? 'Blue' : 'Blue Team',
        flex: 1,
        minWidth: isMobile ? 105 : 150,
      },
      {
        field: 'blue_score',
        headerName: isMobile ? 'B' : 'Blue Score',
        width: isMobile ? 56 : 110,
        minWidth: isMobile ? 56 : 110,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
      },
      {
        field: 'link',
        headerName: '',
        width: isMobile ? 78 : 110,
        minWidth: isMobile ? 78 : 110,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => {
          const { channelId, broadcastId, t } = params.row

          const searchParams = createSearchParams({
            channelId,
            broadcastId,
            t: String(t),
          }).toString()

          return (
            <MuiLink
              component={RouterLink}
              to={{
                pathname: '/broadcast',
                search: searchParams,
              }}
              underline='hover'
              sx={{
                fontWeight: 600,
                fontSize: isMobile ? '0.8rem' : '0.95rem',
                color: 'primary.light',
                '&:visited': {
                  color: 'primary.light',
                },
              }}
            >
              Watch
            </MuiLink>
          )
        },
      },
    ],
    [isMobile]
  )

  const rows: GridRowsProp = useMemo(
    () =>
      filteredMatches.map((match) => ({
        id: `${match.division_name}.${match.match_id}`,
        match_id: convertMatchIdToName(match.match_id),
        red_team: match.red_team,
        red_score: match.red_score,
        blue_team: match.blue_team,
        blue_score: match.blue_score,
        channelId: match.channel_id,
        broadcastId: match.broadcast_id,
        t: match.timestamp,
      })),
    [filteredMatches]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          mb: 2,
          p: { xs: 1.5, sm: 2 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          backgroundImage: 'none',
        }}
      >
        <Typography variant='h6' sx={{ mb: 1.5 }}>
          Match Results — {division}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label='Team ID'
            variant='outlined'
            size='small'
            value={teamQuery}
            onChange={(e) => setTeamQuery(e.target.value)}
            fullWidth={isMobile}
            sx={{ minWidth: { xs: 0, sm: 240 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl
            size='small'
            fullWidth={isMobile}
            sx={{ minWidth: { xs: 0, sm: 200 } }}
          >
            <InputLabel id='division-label'>Division</InputLabel>
            <Select
              labelId='division-label'
              value={division}
              label='Division'
              onChange={handleDivisionChange}
            >
              {DIVISIONS.map((divisionName) => (
                <MenuItem key={divisionName} value={divisionName}>
                  {divisionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box
        sx={{
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          backgroundImage: 'none',
          overflowX: 'auto',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columnDefinitions}
          autoHeight
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          sx={{
            border: 0,
            backgroundColor: 'background.default',
            color: 'text.primary',
            minWidth: isMobile ? 500 : 0,

            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },

            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: isMobile ? '0.75rem' : '0.95rem',
            },

            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              fontSize: isMobile ? '0.8rem' : '0.95rem',
              py: isMobile ? 0.5 : 1,
            },

            '& .MuiDataGrid-row': {
              maxHeight: isMobile ? 44 : 'none',
            },

            '& .MuiDataGrid-row.odd': {
              backgroundColor: 'action.hover',
            },

            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.selected',
            },

            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.default',
            },

            '& .MuiDataGrid-toolbarContainer': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        />
      </Box>
    </Box>
  )
}
