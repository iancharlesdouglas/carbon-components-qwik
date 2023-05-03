import { useContext } from "@builder.io/qwik"
import { prefixContext } from "../components/carbon-app/carbon-app"

/**
 * Prefix for styled elements
 * @returns Prefix, by default 'cds', from the context (context ID 'prefixContext')
 */
export const usePrefix = () => {
  const {prefix} = useContext(prefixContext);
  return prefix;
}