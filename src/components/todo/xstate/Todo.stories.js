/* eslint-disable import/first */
import React from 'react'
import Todos from './Todos'

export default {
  title: 'Components | XState | Todo'
}

export const todo = () => (
  <div className="container-fluid">
    <Todos />
  </div>
)
