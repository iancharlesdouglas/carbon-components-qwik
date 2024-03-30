import { PropFunction, QwikChangeEvent, QwikIntrinsicElements, component$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import { Text } from '../text/text';
import { uniqueId } from '../../internal/unique/unique-id';
import { removeProps } from '../../internal/objects/remove-props';

/**
 * Checkbox props
 * @property {string} class - Custom class for the element
 * @property {string} id - ID of the component
 * @property {string} labelText - Label text
 * @property {PropFunction} onChange - onChange event callback
 * @property {boolean} indeterminate - Whether the state of the checkbox is indeterminate
 * @property {boolean} hideLabel - Whether to hide the label
 * @property {string} title - Accessibility title
 */
export type CheckboxProps = QwikIntrinsicElements['input'] & {
  class?: string;
  id?: string;
  labelText?: string;
  onChange$?: PropFunction<(event: QwikChangeEvent<HTMLInputElement>, element: HTMLInputElement) => void>;
  indeterminate?: boolean;
  hideLabel?: boolean;
  title?: string;
};

/**
 * Checkbox
 */
export const Checkbox = component$((props: CheckboxProps) => {
  const { class: customClass, hideLabel, id, title, labelText } = props;
  const elementId = id ?? uniqueId();
  const prefix = usePrefix();
  const wrapperClasses = classNames(`${prefix}--form-item`, `${prefix}--checkbox-wrapper`, customClass);
  const innerLabelClasses = classNames(`${prefix}--checkbox-label-text`, { [`${prefix}--visually-hidden`]: hideLabel });
  const sanitizedProps = removeProps(props, 'class', 'id', 'labelText', 'indeterminate', 'hideLabel', 'title');
  return (
    <div class={wrapperClasses}>
      <input {...sanitizedProps} type="checkbox" class={`${prefix}--checkbox`} id={elementId} />
      <label for={elementId} class={`${prefix}--checkbox-label`} title={title}>
        <Text class={innerLabelClasses}>{labelText}</Text>
      </label>
    </div>
  );
});
