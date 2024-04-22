import { QRL, QwikIntrinsicElements, component$, $ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import { Key } from '../../internal/key';
import { Close } from '../../internal/icons/close';

/**
 * ListBoxSelection props
 */
export type ListBoxSelectionProps = QwikIntrinsicElements['div'] & {
  selectionCount?: number;
  disabled: boolean;
  readOnly?: boolean;
  clearSelectionDescription?: string;
  clearSelection$: QRL<() => void>;
};

/**
 * Renders a summary of selected items (a badge with a count and a clear button)
 */
export const ListBoxSelection = component$((props: ListBoxSelectionProps) => {
  const prefix = usePrefix();
  const { selectionCount, disabled, readOnly, clearSelection$, clearSelectionDescription } = props;
  const classes = classNames(`${prefix}--list-box__selection`, {
    [`${prefix}--tag--filter`]: selectionCount,
    [`${prefix}--list-box__selection--multi`]: selectionCount,
  });
  const tagClasses = classNames(`${prefix}--tag`, `${prefix}--tag--filter`, `${prefix}--tag--high-contrast`, {
    [`${prefix}--tag--disabled`]: disabled,
  });
  const clearAllDescription = 'Clear all';
  const description = selectionCount && selectionCount > 1 ? clearSelectionDescription : clearAllDescription;
  const handleClearClick$ = $((event: MouseEvent) => {
    event.stopPropagation();
    if (disabled || readOnly) {
      return;
    }
    clearSelection$();
  });
  const handleClearKeyDown$ = $((event: KeyboardEvent) => {
    event.stopPropagation();
    if (disabled || readOnly) {
      return;
    }
    if (event.key === Key.Enter) {
      clearSelection$();
    }
  });

  return selectionCount ? (
    <div class={tagClasses}>
      <span class={`${prefix}--tag__label`} title={`${selectionCount}`}>
        {selectionCount}
      </span>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        class={`${prefix}--tag__close-icon`}
        onClick$={handleClearClick$}
        onKeyDown$={handleClearKeyDown$}
        aria-disabled={disabled || readOnly}
        aria-label={clearAllDescription}
        title={description}
      >
        <Close size={16} />
      </div>
    </div>
  ) : (
    <div
      role="button"
      class={classes}
      onClick$={handleClearClick$}
      onKeyDown$={handleClearKeyDown$}
      tabIndex={disabled ? -1 : 0}
      aria-label={description}
      title={description}
    >
      {selectionCount}
      <Close size={16} />
    </div>
  );
});
