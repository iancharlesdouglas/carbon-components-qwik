import { QwikIntrinsicElements, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import _ from 'lodash';

/**
 * ListBoxMenuItem props
 * @property {boolean} isActive - Whether the menu item is active
 * @property {boolean} isHighlighted - Whether the menu item is highlighted
 * @property {string} title - Title to show in tooltip
 */
export type ListBoxMenuItemProps = QwikIntrinsicElements['div'] & {
  isActive: boolean;
  isHighlighted: boolean;
  title?: string;
  // onClick$?: PropFunction<(event: QwikMouseEvent<HTMLDivElement, MouseEvent>, element: HTMLDivElement) => void>;
};

/**
 * ListBoxMenuItem
 */
export const ListBoxMenuItem = component$((props: ListBoxMenuItemProps) => {
  const { isActive, isHighlighted, title = '' } = props;
  const prefix = usePrefix();
  const isTruncated = useSignal(false);
  const divElementRef = useSignal<Element>();

  useVisibleTask$(({ track }) => {
    track(divElementRef);
    if (divElementRef.value) {
      const divElement = divElementRef.value as HTMLDivElement;
      const parentDivWidth = divElement.parentElement?.offsetWidth ?? divElement.offsetWidth;
      isTruncated.value = parentDivWidth < divElement.offsetWidth;
    }
  });

  const classes = classNames(`${prefix}--list-box__menu-item`, {
    [`${prefix}--list-box__menu-item--active`]: isActive,
    [`${prefix}--list-box__menu-item--highlighted`]: isHighlighted,
  });
  const sanitizedProps = _.omit(props, 'isActive', 'isHighlighted', 'title');

  return (
    <div
      {...sanitizedProps}
      class={classes}
      title={isTruncated.value ? title : undefined}
      tabIndex={-1}
      ref={divElementRef}
      // onClick$={$((event: QwikMouseEvent<HTMLDivElement, MouseEvent>, element: HTMLDivElement) => {
      //   props.onClick$ && props.onClick$(event, element);
      // })}
    >
      <div class={`${prefix}--list-box__menu-item__option`}>
        <Slot />
      </div>
    </div>
  );
});
