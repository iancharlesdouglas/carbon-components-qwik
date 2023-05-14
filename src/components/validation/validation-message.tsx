import { component$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/use-prefix';

export type ValidationMessageProps = {
  invalidId: string;
  invalidText: string;
};

export const ValidationMessage = component$(({ invalidId, invalidText }: ValidationMessageProps) => {
  const prefix = usePrefix();
  return (
    <div class={`${prefix}--form-requirement`} id={invalidId}>
      {invalidText}
    </div>
  );
});
