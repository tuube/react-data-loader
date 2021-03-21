import React from "react";

import { useDataSource, AppDataSources } from "./dataLoader";

interface TestProps {
  name: string;
  dataSource: keyof AppDataSources;
}

const Test = ({ name, dataSource }: TestProps): React.ReactElement => {
  const value = useDataSource(dataSource);

  return (
    <div>
      {name} {value}
    </div>
  );
};

export default Test;
