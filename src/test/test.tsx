import { Component, component$, useSignal } from "@builder.io/qwik";
import { CarbonRoot } from "../components/carbon-root/carbon-root";
import { Link, LinkProps } from "../components/link/link";
import { Add, Copy, Edit, IconProps } from "carbon-icons-qwik";
import { Button } from "../components/button/button";

const Test = component$(() => {
  return (
    <CarbonRoot>
    <Link href="https://github.com" target='blank' data-x="test" id="link_id" size="lg" visited renderIcon onClick$={() => alert('clicked')}>GitHub
      <Edit q:slot="icon" size={20}></Edit>
    </Link>
    <Button size="md" title="Button" onClick$={() => alert('clicked')} hasIconOnly={true}>Test
      <Add q:slot="icon" size={16} />
    </Button>
  </CarbonRoot>);
});

export default Test;