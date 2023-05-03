import { CarbonApp } from './components/carbon-app/carbon-app';
import { Counter } from './components/counter/counter';
import { Link } from './components/link/link';
import { Logo } from './components/logo/logo';

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <CarbonApp>
          <Link href="https://github.com" target='blank' data-x="test" onClick$={() => alert('clicked')}>GitHub</Link>
          <Logo />
          <Counter />
        </CarbonApp>
      </body>
    </>
  );
};
