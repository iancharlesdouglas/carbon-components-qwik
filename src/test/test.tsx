import { Component, component$, useSignal } from "@builder.io/qwik";
import { CarbonRoot } from "../components/carbon-root/carbon-root";
import { Link, LinkProps } from "../components/link/link";
import { Add, Copy, Edit, IconProps } from "carbon-icons-qwik";
import { Button } from "../components/button/button";

const Test = component$(() => {
  return (
    <CarbonRoot>
    <Link href="https://github.com" target='blank' data-x="test" id="link_id" size="lg" visited renderIcon={Edit} onClick$={() => alert('clicked')}>GitHub
    </Link>
    <Button size="sm" title="Button" onClick$={() => alert('clicked')} hasIconOnly={true} renderIcon={Add} class="test-class">Test
      <Add q:slot="icon" size={16} />
    </Button>
    <Button href="https://github.com">Link button</Button>
  </CarbonRoot>);
});

export default Test;