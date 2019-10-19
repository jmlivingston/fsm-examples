import { addParameters, configure } from '@storybook/react'
import { themes } from '@storybook/theming'
import 'bootswatch/dist/darkly/bootstrap.min.css'

addParameters({
  options: {
    theme: themes.dark
  }
})

configure(require.context('../../src', true, /\.stories\.js$/), module)
