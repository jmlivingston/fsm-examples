import { useService } from '@xstate/react'
import React, { useEffect, useRef } from 'react'
import { TODO_STATES } from './Todo.machine'

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
      <div className="form-check float-left">
        <input
          checked={state.context.completed}
          className="form-check-input"
          onChange={() => send(TODO_STATES.TOGGLE_COMPLETE)}
          type="checkbox"
          value={state.context.completed}
        />
        <label
          className="form-check-label"
          onDoubleClick={() => send(TODO_STATES.EDIT)}
          style={{ textDecoration: state.context.completed ? 'line-through' : 'none' }}>
          {state.context.title}
        </label>
      </div>
      <button
        className="btn btn-danger btn-sm float-right"
        onClick={() => send(TODO_STATES.DELETE)}>
        Delete
      </button>
      {/* 
        // Not sure what this is for. Editing?
      <input
        className="form-control"
        onBlur={() => send(TODO_STATES.BLUR)}
        onChange={e => send(TODO_STATES.CHANGE, { value: e.target.value })}
        onKeyDown={e => e.key === 'Escape' && send(TODO_STATES.CANCEL)}
        onKeyPress={e => e.key === 'Enter' && send(TODO_STATES.COMMIT)}
        ref={inputRef}
        value={state.context.title}
      /> */}
    </li>
  )
}

export default Todo
