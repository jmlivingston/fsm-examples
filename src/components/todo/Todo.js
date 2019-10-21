import { useService } from '@xstate/react'
import React, { useEffect, useRef } from 'react'
import { TODO_EVENTS, TODO_STATES } from './Todo.machine'

function Todo({ todoRef }) {
  const [state, send] = useService(todoRef)
  const inputRef = useRef(null)

  useEffect(() => {
    todoRef.execute(state, {
      focusInput() {
        inputRef.current && inputRef.current.select()
      }
    })
  }, [state, todoRef])

  return (
    <li key={state.context.id} className="list-group-item">
      {state.matches(TODO_STATES.EDITING) ? (
        <input
          className="form-control"
          onBlur={() => send(TODO_EVENTS.BLUR)}
          onChange={({ target: { value } }) => send(TODO_EVENTS.CHANGE, { value })}
          onKeyDown={({ key }) => key === 'Escape' && send(TODO_EVENTS.CANCEL)}
          onKeyPress={({ key }) => key === 'Enter' && send(TODO_EVENTS.COMMIT)}
          ref={inputRef}
          value={state.context.title}
        />
      ) : (
        <>
          <div className="form-check float-left">
            <input
              checked={state.context.completed}
              className="form-check-input"
              onChange={() => send(TODO_EVENTS.TOGGLE_COMPLETE)}
              type="checkbox"
              value={state.context.completed}
            />
            <label
              className="form-check-label"
              onDoubleClick={() => send(TODO_EVENTS.EDIT)}
              style={{ textDecoration: state.context.completed ? 'line-through' : 'none' }}>
              {state.context.title}
            </label>
          </div>
          <button
            className="btn btn-danger btn-sm float-right"
            onClick={() => send(TODO_EVENTS.DELETE)}>
            Delete
          </button>
        </>
      )}
    </li>
  )
}

export default Todo
