import React, { useEffect, useState } from 'react';
import { Table, Spinner, Input } from 'vienna-ui';

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

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

const CountriesTable: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedData);
        setFilteredCountries(sortedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  console.log(filteredCountries);

  useEffect(() => {
    const filtered = countries.filter(country => 
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (country.capital?.[0]?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  const handleSort = (_: React.FormEvent | undefined, sortConfig?: { field: string; direction: 'asc' | 'desc' }) => {
    if (!sortConfig) return;

    setSort(sortConfig);
    
    const sortedCountries = [...countries].sort((a, b) => {
      const aValue = sortConfig.field === 'name' ? a.name.common : 
                     sortConfig.field === 'population' ? a.population :
                     sortConfig.field === 'capital' ? (a.capital?.[0] || '') :
                     sortConfig.field === 'region' ? a.region : '';
      
      const bValue = sortConfig.field === 'name' ? b.name.common :
                     sortConfig.field === 'population' ? b.population :
                     sortConfig.field === 'capital' ? (b.capital?.[0] || '') :
                     sortConfig.field === 'region' ? b.region : '';

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setCountries(sortedCountries);
  };

  if (isLoading) return <Spinner size='xl' />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Input
        style={{ marginBottom: '1rem' }}
        placeholder="Search by country, region or capital..."
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
      />
      <Table 
        data={filteredCountries}
        size="m"
        valign="middle"
        dataKey={(item: Country) => item.name.common}
        sort={sort}
        onSort={handleSort}
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
        >
          {(row: Country) => row.population.toLocaleString()}
        </Table.Column>
      </Table>
    </div>
  );
};

export default CountriesTable; 