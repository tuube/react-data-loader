import React from "react";
import { useEffect } from "react";
import { useDataLoader } from "react-data-loader";

interface TestProps {
  name: string;
}

const Test = ({ name }: TestProps): React.ReactElement => {
  const value = useDataLoader<string>("test");

  useEffect(() => {}, [value]);

  return (
    <div>
      {name} {value}
    </div>
  );
};

export default Test;
