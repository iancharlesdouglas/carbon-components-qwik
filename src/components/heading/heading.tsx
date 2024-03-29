import { QwikIntrinsicElements, component$, jsx, useContext } from '@builder.io/qwik';
import { headingContext } from '../../internal/contexts/heading-context';
import _ from 'lodash';
/**
 * Heading props
 * @property text - Text
 */
export type HeadingProps = QwikIntrinsicElements['h1'] & {
  text: string;
};

/**
 * Heading component
 */
export const Heading = component$((props: HeadingProps) => {
  const context = useContext(headingContext);
  const { text } = props;
  const sanitizedProps = _.omit(props, 'children');

  return jsx(`h${context.level}`, { children: [text], ...sanitizedProps });
});
