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
        <Link href="https://github.com"><div>GitHub</div></Link>
        <Logo />
        <Counter />
      </body>
    </>
  );
};
