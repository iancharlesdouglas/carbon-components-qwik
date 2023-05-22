import './root.scss';
import Test from './test/test';

/**
 * Root function
 * @returns Rendered doc.
 */
export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Test />
      </body>
    </>
  );
};
