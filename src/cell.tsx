import React, { Component } from 'react';
import classNames from 'classnames';
import uniqid from 'uniqid';

import styles from './react-isometric-grid.scss';
import { isValidColor } from './utils/misc';

const DEFAULT_STYLE: React.CSSProperties = {
  transformStyle: 'preserve-3d',
  width: '200px',
  height: '200px',
};

const DEFAULT_LAYER_STYLE: React.CSSProperties = {
  width: '200px',
  height: '200px',
};

class Cell extends Component<CellProps> {
  render() {
    const {
      layers,
      href,
      title,
      style = DEFAULT_STYLE,
      layerStyle = DEFAULT_LAYER_STYLE,
      onClick,
    } = this.props;

    const layerList = layers.map((layer) => {
      if (!layer) {
        return null;
      }
      if (isValidColor(layer)) {
        return (
          <div
            className={styles.layer}
            key={uniqid()}
            style={{
              ...DEFAULT_LAYER_STYLE,
              ...layerStyle,
              backgroundColor: layer,
            }}
          />
        );
      }
      return (
        <img
          alt=""
          className={classNames([styles.grid__img, styles.layer])}
          key={uniqid()}
          src={layer}
          style={{ ...DEFAULT_LAYER_STYLE, ...layerStyle }}
        />
      );
    });

    return (
      <li className={styles.grid__item}>
        <a
          className={classNames({
            [styles.grid__link]: true,
            [styles['grid__link--onclick']]: !!onClick,
          })}
          href={href || undefined}
          onClick={onClick}
          style={{ ...DEFAULT_STYLE, ...style }}
        >
          {layerList.reverse()}
          {!!title && <span className={styles.grid__title}>{title}</span>}
        </a>
      </li>
    );
  }
}

export type CellProps = {
  // arry of images to be in the stack, or hex string for layer colors
  layers: string[];

  // onclick navigation link
  href: string;

  // onClick function
  onClick: () => void;

  // optional tital for the stack
  title: string;

  // styling for the Cell element
  style: React.CSSProperties;

  // styling for the individual layers
  layerStyle: React.CSSProperties;
};

export default Cell;
