import { actions, Machine, sendParent } from 'xstate'
import { TODOS_EVENTS } from './Todos.machine'
const { assign } = actions

const TODO_EVENTS = Object.freeze({
  BLUR: 'BLUR',
  CANCEL: 'CANCEL',
  CHANGE: 'CHANGE',
  COMMIT: 'COMMIT',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
  SET_ACTIVE: 'SET_ACTIVE',
  SET_COMPLETED: 'SET_COMPLETED',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE'
})

const TODO_STATES = Object.freeze({
  COMPLETED: 'completed',
  DELETED: 'deleted',
  EDITING: 'editing',
  HISTORY: 'hist',
  PENDING: 'pending',
  READING: 'reading',
  READING_COMPLETED: 'reading.completed',
  READING_HISTORY: 'reading.hist',
  UNKNOWN: 'unknown'
})

const TODO_MACHINE = Object.freeze({
  id: 'todo',
  initial: TODO_STATES.READING,
  context: {
    id: undefined,
    title: '',
    prevTitle: ''
  },
  on: {
    [TODO_EVENTS.TOGGLE_COMPLETE]: {
      target: `.${TODO_STATES.READING_COMPLETED}`,
      actions: [
        assign({ completed: true }),
        sendParent(ctx => ({ type: TODOS_EVENTS.TODO_COMMIT, todo: ctx }))
      ]
    },
    [TODO_EVENTS.DELETE]: TODO_STATES.DELETED
  },
  states: {
    [TODO_STATES.DELETED]: {
      onEntry: sendParent(ctx => ({ type: TODOS_EVENTS.TODO_DELETE, id: ctx.id }))
    },
    [TODO_STATES.EDITING]: {
      onEntry: assign({ prevTitle: ctx => ctx.title }),
      on: {
        [TODO_EVENTS.CHANGE]: {
          actions: assign({
            title: (ctx, e) => e.value
          })
        },
        [TODO_EVENTS.COMMIT]: [
          {
            target: TODO_STATES.READING_HISTORY,
            actions: sendParent(ctx => ({ type: TODOS_EVENTS.TODO_COMMIT, todo: ctx })),
            cond: ctx => ctx.title.trim().length > 0
          },
          { target: TODO_STATES.DELETED }
        ],
        [TODO_EVENTS.BLUR]: {
          target: TODO_STATES.READING,
          actions: sendParent(ctx => ({ type: TODOS_EVENTS.TODO_COMMIT, todo: ctx }))
        },
        [TODO_EVENTS.CANCEL]: {
          target: TODO_STATES.READING,
          actions: assign({ title: ctx => ctx.prevTitle })
        }
      }
    },
    [TODO_STATES.READING]: {
      initial: TODO_STATES.UNKNOWN,
      states: {
        [TODO_STATES.UNKNOWN]: {
          on: {
            '': [
              { target: TODO_STATES.COMPLETED, cond: ctx => ctx.completed },
              { target: TODO_STATES.PENDING }
            ]
          }
        },
        [TODO_STATES.PENDING]: {
          on: {
            SET_COMPLETED: {
              target: TODO_STATES.COMPLETED,
              actions: [
                assign({ completed: true }),
                sendParent(ctx => ({ type: TODOS_EVENTS.TODO_COMMIT, todo: ctx }))
              ]
            }
          }
        },
        [TODO_STATES.COMPLETED]: {
          on: {
            [TODO_EVENTS.TOGGLE_COMPLETE]: {
              target: TODO_STATES.PENDING,
              actions: [
                assign({ completed: false }),
                sendParent(ctx => ({ type: TODOS_EVENTS.TODO_COMMIT, todo: ctx }))
              ]
            },
            [TODO_EVENTS.SET_ACTIVE]: {
              target: TODO_STATES.PENDING,
              actions: [
                assign({ completed: false }),
                sendParent(ctx => ({ type: TODOS_EVENTS.TODO_COMMIT, todo: ctx }))
              ]
            }
          }
        },
        [TODO_STATES.HISTORY]: {
          type: 'history'
        }
      },
      on: {
        [TODO_EVENTS.EDIT]: {
          target: TODO_STATES.EDITING,
          actions: 'focusInput'
        }
      }
    }
  }
})

// TODO: Why can't I export TODO_MACHINE like Toggle.machine.js
// I'd like to do that so I can inject testing like Toggle.test.js
const todoMachine = Machine(TODO_MACHINE)

export { todoMachine, TODO_EVENTS, TODO_STATES }
