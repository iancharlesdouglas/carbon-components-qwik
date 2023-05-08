import { Component, component$, useSignal } from "@builder.io/qwik";
import { CarbonRoot } from "../components/carbon-root/carbon-root";
import { Link, LinkProps } from "../components/link/link";
import { Copy, Edit, IconProps } from "carbon-icons-qwik";

const Test = component$(() => {
  return (
    <CarbonRoot>
    <Link href="https://github.com" target='blank' data-x="test" id="link_id" size="lg" visited renderIcon onClick$={() => alert('clicked')}>GitHub
    <div class="cds--btn">
      <div class="cds--btn--primary">
    <div class="cds--btn__icon">
      <Edit q:slot="icon" size={20}></Edit>
      </div>
      </div>
      </div>
    </Link>
  </CarbonRoot>);
});

export default Test;