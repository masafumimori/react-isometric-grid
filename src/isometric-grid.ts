/*
Credit to codrops for most of this code. I rewrote it as a class and
used npm packages instead of .js files but most of the code is from codrops.com.
 */

import dynamics from 'dynamics.js';
import imagesLoaded from 'imagesloaded';
import Masonry from 'masonry-layout';

import { extend } from './utils/misc';
import {
  getRequestAnimationFrame,
  getCancelAnimationFrame,
} from './utils/animation-frame';
import styles from './react-isometric-grid.scss';

const DEFAULT_OPTIONS = {
  // grid perspective value
  perspective: 0,
  // grid transform
  transform: '',
  // each grid item animation (for the subitems)
  stackItemsAnimation: {
    // this follows the dynamics.js (https://github.com/michaelvillar/dynamics.js) animate fn syntax
    // properties (pos is the current subitem position)
    properties(pos: number) {
      return {
        translateZ: (pos + 1) * 50,
      };
    },
    // animation options (pos is the current subitem position); itemstotal is the total number of subitems
    options() {
      return {
        type: dynamics.bezier,
        duration: 500,
        points: [
          { x: 0, y: 0, cp: [{ x: 0.2, y: 1 }] },
          { x: 1, y: 1, cp: [{ x: 0.3, y: 1 }] },
        ],
      };
    },
  },
  // callback for loaded grid
  onGridLoaded() {
    return false;
  },
} as const;

export type OptionType = {
  perspective: number;
  // grid transform
  transform: string;
  // each grid item animation (for the subitems)
  stackItemsAnimation: {
    // this follows the dynamics.js (https://github.com/michaelvillar/dynamics.js) animate fn syntax
    // properties (pos is the current subitem position)
    properties(pos: number): {
      translateZ: number;
    };
    // animation options (pos is the current subitem position); itemstotal is the total number of subitems
    options(): {
      type: any;
      duration?: number;
      points?: [
        { x: number; y: number; cp: [{ x: number; y: number }] },
        { x: number; y: number; cp: [{ x: number; y: number }] }
      ];
      delay?: number;
    };
  };
  // callback for loaded grid
  onGridLoaded(): boolean;
};

// iso grid class
class IsometricGrid {
  isolayerEl;
  options;
  gridEl: any;
  gridItems;
  gridItemsTotal;
  didscroll;
  requestAnimationFrame;
  cancelAnimationFrame;

  msnry: any;

  constructor(el: any, options: OptionType) {
    this.isolayerEl = el;

    this.options = extend({}, DEFAULT_OPTIONS);
    extend(this.options, options);

    if (!this.isolayerEl) {
      return;
    }

    this.gridEl = this.isolayerEl.querySelector(`.${styles.grid}`);

    // grid items
    this.gridItems = this.gridEl?.querySelectorAll(`.${styles.grid__item}`);

    this.gridItemsTotal = this.gridItems.length;

    this.didscroll = false;

    this.init();

    // animation frame functions
    this.requestAnimationFrame = getRequestAnimationFrame();
    this.cancelAnimationFrame = getCancelAnimationFrame();
  }

  init() {
    const self = this;

    imagesLoaded(this.gridEl, () => {
      // initialize masonry
      self.msnry = new Masonry(self.gridEl, {
        itemSelector: `.${styles.grid__item}`,
        fitWidth: true,
        horizontalOrder: true,
      });

      self.isolayerEl.style.WebkitTransformStyle = 'preserve-3d';
      self.isolayerEl.style.transformStyle = 'preserve-3d';

      const transformValue =
        self.options.perspective !== 0
          ? `perspective(${self.options.perspective}px) ${self.options.transform}`
          : self.options.transform;
      self.isolayerEl.style.WebkitTransform = transformValue;
      self.isolayerEl.style.transform = transformValue;

      // init/bind events
      self.initEvents();

      // grid is "loaded" (all images are loaded)
      self.options.onGridLoaded();
    });
  }

  /**
   * Initialize/Bind events fn.
   */
  initEvents() {
    const self = this;

    this.gridItems.forEach((item: any) => {
      item.addEventListener('mouseenter', (e: MouseEvent) =>
        self.expandSubItems(e.target)
      );
      item.addEventListener('mouseleave', (e: MouseEvent) =>
        self.collapseSubItems(e.target)
      );
    });
  }

  expandSubItems(item: any) {
    const self = this;
    const itemLink = item.querySelector('a');
    const subItems = [].slice.call(
      itemLink.querySelectorAll(`.${styles.layer}`)
    );
    const subItemsTotal = subItems.length;

    itemLink.style.zIndex = this.gridItemsTotal;
    item.style.zIndex = this.gridItemsTotal; // eslint-disable-line no-param-reassign

    subItems.forEach((subitem, pos) => {
      dynamics.stop(subitem);
      dynamics.animate(
        subitem,
        self.options.stackItemsAnimation.properties(pos),
        self.options.stackItemsAnimation.options(pos, subItemsTotal)
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  collapseSubItems(item: any) {
    const itemLink = item.querySelector('a');
    [].slice
      .call(itemLink.querySelectorAll(`.${styles.layer}`))
      .forEach((subitem) => {
        dynamics.stop(subitem);
        dynamics.animate(
          subitem,
          {
            // enough to reset any transform value previously set
            translateZ: 0,
          },
          {
            duration: 100,
            complete() {
              itemLink.style.zIndex = 1;
              item.style.zIndex = 1; // eslint-disable-line no-param-reassign
            },
          }
        );
      });
  }
}

export default IsometricGrid;
