import { QwikIntrinsicElements, Slot, component$, useContext } from '@builder.io/qwik';
import { TextDirection, textDirectionContext } from '../../internal/contexts/text-direction-context';
// import _ from 'lodash';

/**
 * Text component props
 * @property {TextDirection} dir - Text direction
 */
export type TextProps = QwikIntrinsicElements['span'] & {
  dir?: TextDirection;
};

/**
 * Text component
 */
export const Text = component$((props: TextProps) => {
  const { dir: overrideDir } = props;
  const { dir: contextDir } = useContext(textDirectionContext);
  const dirToUse = overrideDir ?? contextDir;
  const sanitizedProps = props; //_.omit(props, 'dir');
  return (
    <span dir={dirToUse} {...sanitizedProps}>
      <Slot />
    </span>
  );
});
