import React from 'react';
import { useDataLoader } from 'react-data-loader';

const Test = (): React.ReactElement => {
  useDataLoader();

  return <div>Test</div>
}

export default Test;