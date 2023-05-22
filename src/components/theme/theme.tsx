import classNames from 'classnames';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { QwikIntrinsicElements, Slot, component$ } from '@builder.io/qwik';

/**
 * Valid theme codes
 */
export type ThemeCode = 'white' | 'g10' | 'g90' | 'g100';

/**
 * Theme props
 * @property {ThemeCode} theme - Selected theme
 * @property {string} class - Custom CSS class for the rendered div element
 */
export type ThemeProps = QwikIntrinsicElements['div'] & {
  theme?: ThemeCode;
  class?: string;
};

/**
 * Theme component
 */
export const Theme = component$(({ theme = 'white', class: customClass }: ThemeProps) => {
  const prefix = usePrefix();
  const classes = classNames(
    customClass,
    {
      [`${prefix}--white`]: theme === 'white',
      [`${prefix}--g10`]: theme === 'g10',
      [`${prefix}--g90`]: theme === 'g90',
      [`${prefix}--g100`]: theme === 'g100',
    },
    `${prefix}--layer-one`
  );
  return (
    <div class={classes}>
      <Slot />
    </div>
  );
});
