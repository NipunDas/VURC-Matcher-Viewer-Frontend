import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const BOXCAST_SCRIPT_SRC = 'https://js.boxcast.com/v3.min.js'
const PLAYER_ID = 'player'

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
        onLoadPlayer: (player: any) => {
          if (startTime > 0 && typeof player.seek === 'function') {
            player.seek(startTime)
          }
        }
      })
    }

    document.body.appendChild(script)
  }, [])

  if (!channelId || !broadcastId) {
    return <div>Missing channel or broadcast ID!</div>
  }

  return (
    <div id={PLAYER_ID} ref={playerDivRef} />
  )
}
