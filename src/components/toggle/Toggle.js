import { useMachine } from '@xstate/react'
import React from 'react'
import { toggleMachine, TOGGLE_EVENTS, TOGGLE_STATES } from './toggleMachine'

function Toggle() {
  const [current, send] = useMachine(toggleMachine)

  return (
    <button
      onClick={() => send(TOGGLE_EVENTS.TOGGLE)}
      className={`btn btn-${current.value === TOGGLE_STATES.INACTIVE ? 'info' : 'primary'}`}>
      {current.value}
    </button>
  )
}

export default Toggle
