import { QwikIntrinsicElements, Slot, component$, useSignal } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import { removeProps } from '../../internal/objects/remove-props';

/**
 * ListBoxMenuItem props
 * @property isActive - Whether the menu item is active (selected)
 * @property isHighlighted - Whether the menu item is highlighted
 * @property title - Title to show in tooltip
 * @property disabled - Whether item is disabled
 */
export type ListBoxMenuItemProps = QwikIntrinsicElements['div'] & {
  isActive: boolean;
  isHighlighted: boolean;
  title?: string;
  disabled?: boolean;
};

/**
 * An item in a listbox menu for a combobox
 */
export const ListBoxMenuItem = component$((props: ListBoxMenuItemProps) => {
  const { isActive, isHighlighted, title = '' } = props;
  const prefix = usePrefix();
  const isTruncated = useSignal(false);
  const divElementRef = useSignal<Element>();

  const classes = classNames(`${prefix}--list-box__menu-item`, {
    [`${prefix}--list-box__menu-item--active`]: isActive,
    [`${prefix}--list-box__menu-item--highlighted`]: isHighlighted,
  });
  const sanitizedProps = removeProps(props, 'isActive', 'isHighlighted', 'title');

  return (
    <div
      {...sanitizedProps}
      class={classes}
      title={isTruncated.value ? title : undefined}
      tabIndex={-1}
      ref={divElementRef}
      role="button"
    >
      <div class={`${prefix}--list-box__menu-item__option`}>
        <Slot />
      </div>
    </div>
  );
});
