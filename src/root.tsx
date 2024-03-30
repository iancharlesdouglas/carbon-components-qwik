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
        <title>Test Harness</title>
      </head>
      <body>
        <Test />
      </body>
    </>
  );
};
