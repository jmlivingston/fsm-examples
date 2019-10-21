import { actions, Machine, sendParent } from 'xstate'
import { TODOS_STATES } from './Todos.machine'
const { assign } = actions

const TODO_STATES = Object.freeze({
  BLUR: 'BLUR',
  CANCEL: 'CANCEL',
  CHANGE: 'CHANGE',
  COMMIT: 'COMMIT',
  COMPLETED: 'completed',
  DELETE: 'DELETE',
  DELETED: 'deleted',
  EDIT: 'EDIT',
  EDITING: 'editing',
  PENDING: 'pending',
  READING: 'reading',
  SET_ACTIVE: 'SET_ACTIVE',
  SET_COMPLETED: 'SET_COMPLETED',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE',
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
    [TODO_STATES.TOGGLE_COMPLETE]: {
      target: '.reading.completed',
      actions: [
        assign({ completed: true }),
        sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
      ]
    },
    [TODO_STATES.DELETE]: TODO_STATES.DELETED
  },
  states: {
    [TODO_STATES.DELETED]: {
      onEntry: sendParent(ctx => ({ type: TODOS_STATES.TODO_DELETE, id: ctx.id }))
    },
    [TODO_STATES.EDITING]: {
      onEntry: assign({ prevTitle: ctx => ctx.title }),
      on: {
        CHANGE: {
          actions: assign({
            title: (ctx, e) => e.value
          })
        },
        COMMIT: [
          {
            target: 'reading.hist',
            actions: sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx })),
            cond: ctx => ctx.title.trim().length > 0
          },
          { target: TODO_STATES.DELETED }
        ],
        BLUR: {
          target: TODO_STATES.READING,
          actions: sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
        },
        CANCEL: {
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
                sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
              ]
            }
          }
        },
        [TODO_STATES.COMPLETED]: {
          on: {
            TOGGLE_COMPLETE: {
              target: TODO_STATES.PENDING,
              actions: [
                assign({ completed: false }),
                sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
              ]
            },
            SET_ACTIVE: {
              target: TODO_STATES.PENDING,
              actions: [
                assign({ completed: false }),
                sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
              ]
            }
          }
        },
        hist: {
          type: 'history'
        }
      },
      on: {
        [TODO_STATES.EDIT]: {
          target: TODO_STATES.EDITING,
          actions: 'focusInput'
        }
      }
    }
  }
})

const todoMachine = Machine(TODO_MACHINE)

export { todoMachine, TODO_STATES }
