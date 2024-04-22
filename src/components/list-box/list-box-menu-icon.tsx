import { component$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import { ChevronDown } from '../../internal/icons/chevron--down';

/**
 * ListBoxMenuIcon props
 * @property {boolean} isOpen - Whether the icon is rendered as open (or closed)
 */
export type ListBoxMenuIconProps = { isOpen: boolean };

/**
 * ListBox menu icon
 */
export const ListBoxMenuIcon = component$(({ isOpen }: ListBoxMenuIconProps) => {
  const prefix = usePrefix();
  const classes = classNames(`${prefix}--list-box__menu-icon`, { [`${prefix}--list-box__menu-icon--open`]: isOpen });
  const description = `${isOpen ? 'Close' : 'Open'} menu`;
  return (
    <div class={classes}>
      <ChevronDown aria-label={description} title={description} size={12} />
    </div>
  );
});
