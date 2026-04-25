import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const BOXCAST_SCRIPT_SRC = 'https://js.boxcast.com/v3.min.js'
const PLAYER_ID = 'player'

const attemptSeekWithRetries = (player: any, seekTime: number, numRetries: number = 10) => {
  console.log(`${numRetries} retries left, attempting to seek to timestamp ${seekTime}`)
  if (typeof player.seek === 'function') {
    player.seek(seekTime)
    console.log('Successful seek')
  } else if (numRetries > 0) {
    // Retry in half-second intervals
    setTimeout(() => attemptSeekWithRetries(player, seekTime, numRetries - 1), 500)
  }
}

export const BoxcastPlayer: React.FunctionComponent = () => {
  const playerDivRef = useRef<HTMLDivElement | null>(null)
  const [searchParams] = useSearchParams()

  // Parse params to get the specific broadcast and starting time
  const channelId = searchParams.get('channelId')
  const broadcastId = searchParams.get('broadcastId')
  const startTime = Number(searchParams.get('t') || 0)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = BOXCAST_SCRIPT_SRC
    script.async = true

    script.onload = () => {
      console.log(!!playerDivRef.current)
      if (!playerDivRef.current) return

      const boxcast = (window as any).boxcast
      console.log(boxcast)

      boxcast(`#${PLAYER_ID}`).loadChannel(channelId, {
        selectedBroadcastId: broadcastId,
        onLoadPlayer: (player: any) => {
          
          if (startTime > 0) {
            attemptSeekWithRetries(player, startTime)
          }
        }
      })
    }

    document.body.appendChild(script)
  }, [channelId, broadcastId, startTime])

  if (!channelId || !broadcastId) {
    return <div>Missing channel or broadcast ID!</div>
  }

  return (
    <div id={PLAYER_ID} ref={playerDivRef} />
  )
}
