import { CarbonRoot } from './components/carbon-root/carbon-root';
import { Counter } from './components/counter/counter';
import { Link } from './components/link/link';
import { Logo } from './components/logo/logo';
import  { Add, Copy, DOC, Edit, Eyedropper } from 'carbon-icons-qwik';
import './root.scss';

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
        
      </head>
      <body>
        <CarbonRoot>
          <Link href="https://github.com" target='blank' data-x="test" id="link_id" size="lg" visited onClick$={() => alert('clicked')} renderIcon={true}>GitHub
            <Edit q:slot="icon" size={20}></Edit>
          </Link>
          <Logo />
          <Counter />
          <Add fill="red" size={24} id="one" title="Add" />
          <Copy />
          <DOC/>
          <Edit />
          <Eyedropper />
        </CarbonRoot>
      </body>
    </>
  );
};
