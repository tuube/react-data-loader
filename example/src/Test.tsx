import React, { useState } from "react";

import { useDataSource, AppDataSources } from "./dataLoader";

interface TestProps {
  name: string;
  dataSource: keyof AppDataSources;
}

const Test = ({ name, dataSource }: TestProps): React.ReactElement => {
  const [innerValue, setInnerValue] = useState('');

  const value = useDataSource(dataSource, (value) => {
    setInnerValue('inner' + value);
  });

  return (
    <div>
      {name} {value} ({innerValue})
    </div>
  );
};

export default Test;
