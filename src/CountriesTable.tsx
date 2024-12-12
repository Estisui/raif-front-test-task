import React from 'react';
import { Table } from 'vienna-ui';

const CountriesTable: React.FC = () => {
  // Hardcoded country data
  const countries = [
    { id: 1, name: 'Germany', capital: 'Berlin', population: 83783942 },
    { id: 2, name: 'France', capital: 'Paris', population: 65273511 },
    { id: 3, name: 'Italy', capital: 'Rome', population: 60244639 },
  ];

  return (
    <Table data={countries}>
      <Table.Column id='id' title='#' />
      <Table.Column id='name' title='Name' />
      <Table.Column id='capital' title='Capital' />
      <Table.Column id='population' title='Population' />
    </Table>
  );
};

export default CountriesTable; 