import { useContext } from '@builder.io/qwik';
import { prefixContext } from '../components/carbon-root/carbon-root';

/**
 * Prefix for styled elements
 * @returns {string} Prefix, by default 'cds', from the context (context ID 'prefixContext')
 */
export const usePrefix = (): string => {
  const { prefix } = useContext(prefixContext);
  return prefix;
};
