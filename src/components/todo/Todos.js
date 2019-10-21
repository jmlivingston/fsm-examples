import { useMachine } from '@xstate/react'
import React from 'react'
import { Machine } from 'xstate'
import Todo from './Todo'
import { TODOS_MACHINE, TODOS_STATES } from './Todos.machine'

const todosMachine = Machine(TODOS_MACHINE)

function filterTodos(state, todos) {
  if (state.matches('active')) {
    return todos.filter(todo => !todo.completed)
  }

  if (state.matches('completed')) {
    return todos.filter(todo => todo.completed)
  }

  return todos
}

const persistedTodosMachine = todosMachine.withConfig(
  {
    actions: {
      persist: ctx => {
        localStorage.setItem('todos-xstate', JSON.stringify(ctx.todos))
      }
    }
  },
  {
    todo: 'Learn state machines',
    todos: (() => {
      try {
        return JSON.parse(localStorage.getItem('todos-xstate')) || []
      } catch (e) {
        return []
      }
    })()
  }
)

function Todos() {
  const [state, send] = useMachine(persistedTodosMachine)
  const { todos, todo } = state.context

  const numActiveTodos = todos.filter(todo => !todo.completed).length
  const allCompleted = todos.length > 0 && numActiveTodos === 0
  const mark = !allCompleted ? 'completed' : 'active'
  const markEvent = `MARK.${mark}`
  const filteredTodos = filterTodos(state, todos)

  return (
    <section data-state={state.toStrings()}>
      <header>
        <h1>Todos</h1>
        <input
          className="form-control"
          placeholder="What needs to be done?"
          autoFocus
          onKeyPress={e => {
            if (e.key === 'Enter') {
              send(TODOS_STATES.NEWTODO_COMMIT, { value: e.target.value })
            }
          }}
          onChange={e => send(TODOS_STATES.NEWTODO_CHANGE, { value: e.target.value })}
          value={todo}
        />
      </header>

      <ul className="nav nav-tabs my-3">
        <li className="nav-item">
          <a
            className={`nav-link ${state.matches('all') ? 'active' : 'cursor-pointer'}`}
            onClick={() => send(TODOS_STATES.SHOW_ALL)}>
            All
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${state.matches('active') ? 'active' : 'cursor-pointer'}`}
            onClick={() => send(TODOS_STATES.SHOW_ACTIVE)}>
            Active
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${state.matches('completed') ? 'active' : 'cursor-pointer'}`}
            onClick={() => send(TODOS_STATES.SHOW_COMPLETED)}>
            Complete
          </a>
        </li>
      </ul>

      <section>
        {todos.length > 0 ? (
          <div className="form-check">
            <input
              id="toggle-all"
              className="form-check-input"
              type="checkbox"
              checked={allCompleted}
              onChange={() => {
                send(markEvent)
              }}
            />
            <label htmlFor="toggle-all" title={`Mark all as ${mark}`} className="form-check-label">
              Mark all as {mark}
            </label>
          </div>
        ) : (
          'Add some todos'
        )}
        <ul className="list-group my-3">
          {filteredTodos.map(todo => (
            <Todo key={todo.id} todoRef={todo.ref} />
          ))}
        </ul>
      </section>
      {!!todos.length && (
        <footer>
          <span>
            <strong>{numActiveTodos}</strong> item
            {numActiveTodos === 1 ? '' : 's'} left
          </span>
          <br />
          {numActiveTodos < todos.length && (
            <button
              className="btn btn-success mt-3"
              onClick={_ => send(TODOS_STATES.CLEAR_COMPLETED)}>
              Clear Completed
            </button>
          )}
        </footer>
      )}
    </section>
  )
}

export default Todos
