import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const BOXCAST_SCRIPT_SRC = 'https://js.boxcast.com/v3.min.js'
const PLAYER_ID = 'player'

const attemptSeekWithRetries = (player: any, seekTime: number, numRetries: number = 10) => {
  if (typeof player.seek === 'function') {
    try {
      player.seek(seekTime)
      return
    } catch (error) {
      console.log(error)
    }
  }
  
  if (numRetries > 0) {
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
      if (!playerDivRef.current) return

      const boxcast = (window as any).boxcast
      boxcast(`#${PLAYER_ID}`).loadChannel(channelId, {
        selectedBroadcastId: broadcastId,
        onLoadPlayer: async (player: any) => {
          console.log('player loaded', player)

          // 1) Force actual playback first.
          if (typeof player.play === 'function') {
            try {
              await player.play()
              console.log('play() resolved')
            } catch (e) {
              console.log('play() failed', e)
            }
          }

          // 2) Wait a bit longer than your current retry cadence.
          await new Promise(r => setTimeout(r, 3000))

          // 3) Try a very small rewind first, not a large absolute jump.
          try {
            player.seek(10)
            console.log('seek(10) called')
          } catch (e) {
            console.log('seek failed', e)
          }

          // 4) Then try your intended time.
          if (startTime > 0) {
            try {
              player.seek(startTime)
              console.log('seek(startTime) called')
            } catch (e) {
              console.log('seek(startTime) failed', e)
            }
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
