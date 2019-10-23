import { useMachine } from '@xstate/react'
import React from 'react'
import { Machine } from 'xstate'
import { TOGGLE_EVENTS, TOGGLE_MACHINE, TOGGLE_STATES } from './Toggle.machine'

function Toggle() {
  const [current, send] = useMachine(Machine(TOGGLE_MACHINE))
  return (
    <button
      onClick={() => send(TOGGLE_EVENTS.TOGGLE)}
      className={`btn btn-${current.value === TOGGLE_STATES.INACTIVE ? 'info' : 'primary'}`}>
      {current.value}
    </button>
  )
}

export default Toggle
