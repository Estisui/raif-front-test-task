import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'vienna-ui';

interface Country {
  name: {
    common: string;
  };
  capital?: string[];
  population: number;
  flags: {
    png: string;
  };
  region: string;
}

const CountriesTable: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        const sortedData = data.sort((a: Country, b: Country) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (isLoading) {
    return <Spinner size='xl' />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table 
      data={countries}
      size="m"
      valign="middle"
      dataKey={(item: Country) => item.name.common}
    >
      <Table.Column 
        id="flag" 
        title="Flag"
      >
        {(row: Country) => (
          <img 
            src={row.flags.png} 
            alt={`${row.name.common} flag`}
            style={{ width: '30px', height: 'auto' }}
          />
        )}
      </Table.Column>
      <Table.Column 
        id="name" 
        title="Country"
        sortable
      >
        {(row: Country) => row.name.common}
      </Table.Column>
      <Table.Column 
        id="region" 
        title="Region"
        sortable
      >
        {(row: Country) => row.region}
      </Table.Column>
      <Table.Column 
        id="capital" 
        title="Capital"
        sortable
      >
        {(row: Country) => row.capital?.[0] || '—'}
      </Table.Column>
      <Table.Column 
        id="population" 
        title="Population"
        sortable
        // align="right"
      >
        {(row: Country) => row.population.toLocaleString()}
      </Table.Column>
    </Table>
  );
};

export default CountriesTable; 