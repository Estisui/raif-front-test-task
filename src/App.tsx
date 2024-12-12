import React from 'react';
import { Heading } from 'vienna-ui';
import CountriesTable from "./CountriesTable";

const App: React.FC = () => {
  return (
    <div>
      <Heading>Countries Information</Heading>
      <CountriesTable />
    </div>
  );
};

export default App
