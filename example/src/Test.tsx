import React from "react";
import { useEffect } from "react";
import { useDataLoader } from "react-data-loader";


interface TestProps {
  name: string;
  dataSource: string;
}

const Test = ({ name, dataSource }: TestProps): React.ReactElement => {
  const value = useDataLoader<string>(dataSource);

  return (
    <div>
      {name} {value}
    </div>
  );
};

export default Test;
