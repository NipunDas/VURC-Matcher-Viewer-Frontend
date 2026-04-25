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

export type Division = 'Math' | 'Technology'

const MATCHES_JSON_FILE = '/RE-VURC-24-8911.json'
const DIVISIONS: Division[] = ['Math', 'Technology']

const convertMatchIdToName = (matchId: string): string => {
  if (matchId.startsWith('QUAL')) {
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
  const [division, setDivision] = useState<Division>('Math')

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

  const columnDefinitions: GridColDef[] = [
    { field: 'match_id', headerName: 'Match', minWidth: 120, width: 130 },
    { field: 'division_name', headerName: 'Division', minWidth: 130, width: 140 },
    { field: 'red_team', headerName: 'Red Team', flex: 1, minWidth: 150 },
    {
      field: 'red_score',
      headerName: 'Red Score',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      type: 'number',
    },
    { field: 'blue_team', headerName: 'Blue Team', flex: 1, minWidth: 150 },
    {
      field: 'blue_score',
      headerName: 'Blue Score',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      type: 'number',
    },
    {
      field: 'link',
      headerName: '',
      width: 110,
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
  ]

  const rows: GridRowsProp = useMemo(
    () =>
      filteredMatches.map((match) => ({
        id: `${match.division_name}.${match.match_id}`,
        match_id: convertMatchIdToName(match.match_id),
        division_name: match.division_name,
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
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          // Helps avoid odd dark-mode paper overlay behavior when heavily restyling surfaces
          backgroundImage: 'none',
        }}
      >
        <Typography variant='h6' sx={{ mb: 1.5 }}>
          Match Results
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label='Team ID'
            variant='outlined'
            size='small'
            value={teamQuery}
            onChange={(e) => setTeamQuery(e.target.value)}
            sx={{ minWidth: 240 }}
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

          <FormControl size='small' sx={{ minWidth: 200 }}>
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
          overflow: 'hidden',
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

            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },

            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },

            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
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
