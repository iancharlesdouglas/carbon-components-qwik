import { QwikIntrinsicElements, Slot, component$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';

/**
 * Column span
 */
export type ColumnSpan = number | string | { span: number; start: number; end: number };

/**
 * Breakpoint
 */
export type Breakpoint =
  | number
  | boolean
  | string
  | { span?: number | string; offset?: number; start?: number; end?: number };

/**
 * Column props
 * @property {string} class - Custom CSS class
 * @property {Breakpoint} sm - Small res. breakpoint definition
 * @property {Breakpoint} md - Medium res. breakpoint definition
 * @property {Breakpoint} lg - Large res. breakpoint definition
 * @property {Breakpoint} xlg - Extra-large res. breakpoint definition
 * @property {Breakpoint} max - Max. res. breakpoint definition
 * @property {ColumnSpan} span - Span definition
 */
export type ColumnProps = QwikIntrinsicElements['div'] & {
  class?: string;
  sm?: Breakpoint;
  md?: Breakpoint;
  lg?: Breakpoint;
  xlg?: Breakpoint;
  max?: Breakpoint;
  span?: ColumnSpan;
};

/**
 * Column
 */
export const Column = component$((props: ColumnProps) => {
  const prefix = usePrefix();
  const { span, class: customClass } = props;
  const breakpointClass = getClassesForBreakpoints(props, prefix);
  const spanClass = getClassesForSpan(span, prefix);
  const classes = classNames(customClass, breakpointClass, spanClass, `${prefix}--css-grid-column`);
  const sanitizedProps = props; // _.omit(props, 'class', 'sm', 'md', 'lg', 'xlg', 'max', 'span');
  return (
    <div class={classes} {...sanitizedProps}>
      <Slot />
    </div>
  );
});

const getClassesForBreakpoints = (props: ColumnProps, prefix: string): string => {
  const { sm, md, lg, xlg, max } = props;
  const breakpointNames = ['sm', 'md', 'lg', 'xlg', 'max'];
  return [sm, md, lg, xlg, max]
    .map((breakpoint, index) => ({ breakpoint, index }))
    .filter(({ breakpoint }) => !!breakpoint)
    .map(({ breakpoint, index }) => {
      if (breakpoint === true) {
        return `${prefix}--${breakpointNames[index]}:col-span-auto`;
      }
      if (typeof breakpoint === 'string') {
        return `${prefix}--${breakpointNames[index]}:col-span-${breakpoint.slice(0, -1)}`;
      }
      if (typeof breakpoint === 'number') {
        return `${prefix}--${breakpointNames[index]}:col-span-${breakpoint}`;
      }
      if (typeof breakpoint === 'object') {
        const { span, offset, start, end } = breakpoint;
        const spanClasses = [];
        if (typeof offset === 'number' && offset > 0) {
          spanClasses.push(`${prefix}--${breakpointNames[index]}:col-start-${offset + 1}`);
        }
        if (typeof start === 'number') {
          spanClasses.push(`${prefix}--${breakpointNames[index]}:col-start-${start}`);
        }
        if (typeof end === 'number') {
          spanClasses.push(`${prefix}--${breakpointNames[index]}:col-end-${end}`);
        }
        if (typeof span === 'number') {
          spanClasses.push(`${prefix}--${breakpointNames[index]}:col-span-${span}`);
        } else if (typeof span === 'string') {
          spanClasses.push(`${prefix}--${breakpointNames[index]}:col-span-${span.slice(0, -1)}`);
        }
        return spanClasses.join(' ');
      }
    })
    .join(' ');
};

const getClassesForSpan = (spanDef: ColumnSpan | undefined, prefix: string): string => {
  if (typeof spanDef === 'number' || typeof spanDef === 'string') {
    return `${prefix}--col-span-${spanDef}`;
  }
  if (typeof spanDef === 'object') {
    const spanClasses = [];
    const { span, start, end } = spanDef;
    if (span) {
      spanClasses.push(`${prefix}--col-span-${span}`);
    }
    if (start) {
      spanClasses.push(`${prefix}--col-start-${start}`);
    }
    if (end) {
      spanClasses.push(`${prefix}--col-end-${end}`);
    }
    return spanClasses.join(' ');
  }
  return '';
};
