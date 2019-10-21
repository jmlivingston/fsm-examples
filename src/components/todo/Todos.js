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
      persist: ctx => localStorage.setItem('todos-xstate', JSON.stringify(ctx.todos))
    }
  },
  {
    todo: '',
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

  const numActiveTodos = state.context.todos.filter(todo => !todo.completed).length
  const allCompleted = state.context.todos.length > 0 && numActiveTodos === 0
  const mark = !allCompleted ? 'completed' : 'active'
  const filteredTodos = filterTodos(state, state.context.todos)

  return (
    <section>
      <header>
        <h1>Todos</h1>
        <input
          className="form-control"
          placeholder="What needs to be done?"
          autoFocus
          onKeyPress={e =>
            e.key === 'Enter' && send(TODOS_STATES.NEWTODO_COMMIT, { value: e.target.value })
          }
          onChange={e => send(TODOS_STATES.NEWTODO_CHANGE, { value: e.target.value })}
          value={state.context.todo}
        />
      </header>

      {!!state.context.todos.length ? (
        <>
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
          <div className="form-check">
            <input
              checked={allCompleted}
              className="form-check-input"
              id="toggle-all"
              onChange={() => send(`MARK.${mark}`)}
              type="checkbox"
            />
            <label htmlFor="toggle-all" title={`Mark all as ${mark}`} className="form-check-label">
              Mark all as {mark}
            </label>
          </div>
          <ul className="list-group my-3">
            {filteredTodos.map(todo => (
              <Todo key={todo.id} todoRef={todo.ref} />
            ))}
          </ul>
          <footer>
            <span>
              <strong>{numActiveTodos}</strong> item
              {numActiveTodos === 1 ? '' : 's'} left
            </span>
            <br />
            {numActiveTodos < state.context.todos.length && (
              <button
                className="btn btn-success mt-3"
                onClick={() => send(TODOS_STATES.CLEAR_COMPLETED)}>
                Clear Completed
              </button>
            )}
          </footer>
        </>
      ) : (
        <div className="mt-3">Add some todos!</div>
      )}
    </section>
  )
}

export default Todos
