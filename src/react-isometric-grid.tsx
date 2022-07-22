import React, { Component, ReactNode } from 'react'
import dynamics from 'dynamics.js'
import classNames from 'classnames'

import styles from './react-isometric-grid.scss'
import IsometricGrid, { OptionType } from './isometric-grid'

class ReactIsometricGrid extends Component<ReactIsometricGridProps> {
  isometricGrid: any

  componentDidMount() {
    const {
      onGridLoaded,
      perspective = DEFAULT_PROPS.perspective,
      transform = DEFAULT_PROPS.transform,
      stackItemsAnimation,
    } = this.props

    this.isometricGrid = new IsometricGrid(document.querySelector(`.${styles.isolayer}`), {
      perspective,
      transform,
      stackItemsAnimation,
      onGridLoaded,
    })
  }

  render() {
    const { style = DEFAULT_PROPS.style, shadow = DEFAULT_PROPS.shadow, children } = this.props

    return (
      <div
        className={classNames({
          [styles.isolayer]: true,
          [styles['isolayer--shadow']]: shadow,
        })}
        style={style}
      >
        <ul className={styles.grid}>{children}</ul>
      </div>
    )
  }
}

type ReactIsometricGridProps = {
  // have a shadow under the cells
  shadow: boolean

  // ongridloaded callback
  onGridLoaded: OptionType['onGridLoaded']

  // style
  style: React.CSSProperties

  // children (Cell elements)
  children: ReactNode

  // perspective value, # of px distance from z origin
  perspective: number

  // transform of the isometric grid in 3d space
  // https://www.w3schools.com/cssref/css3_pr_transform.asp
  transform: string

  // animation values for each cell dynamicjs
  stackItemsAnimation: OptionType['stackItemsAnimation']
  // {
  //   // object of the properties/values you want to animate
  //   // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function
  //   properties: string,

  //   // object representing the animation like duration and easing
  //   // https://github.com/michaelvillar/dynamics.js#dynamicsanimateel-properties-options
  //   options: string,
  // }
}

const DEFAULT_PROPS = {
  shadow: false,
  onGridLoaded: () => {},
  style: {
    height: '600px',
    width: '600px',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  perspective: 3000,
  transform: 'scale3d(0.8,0.8,1) rotateY(45deg) rotateZ(-10deg)',
  stackItemsAnimation: {
    properties(pos: number) {
      return {
        rotateX: (pos + 1) * -15,
      }
    },
    options(pos: number, totalItems: number) {
      return {
        type: dynamics.spring,
        delay: (totalItems - pos - 1) * 30,
      }
    },
  },
} as const

export default ReactIsometricGrid
