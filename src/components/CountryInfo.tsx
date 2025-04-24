import React from 'react';

type DemographicData = {
  birthRate: number | null;
  deathRate: number | null;
  lifeExpectancy: number | null;
  lastUpdatedYear: string;
};

type CountryInfoProps = {
  name: string;
  population: number;
  capital: string;
  region: string;
  subregion: string;
  demographics: DemographicData;
};

export const CountryInfo: React.FC<CountryInfoProps> = ({
  name,
  population,
  capital,
  region,
  subregion,
  demographics
}) => {
  return (
    <div className="country-info">
      <h2>{name}</h2>
      <p><strong>Population:</strong> {population.toLocaleString()}</p>
      <p><strong>Capital:</strong> {capital}</p>
      <p><strong>Continent:</strong> {region}</p>
      <p><strong>Region:</strong> {subregion}</p>
      <div className="demographics">
        <h3>Demographic Data</h3>
        <p><strong>Birth rate:</strong> {demographics.birthRate ?? 'N/A'}</p>
        <p><strong>Death rate:</strong> {demographics.deathRate ?? 'N/A'}</p>
        <p><strong>Life expectancy:</strong> {demographics.lifeExpectancy ?? 'N/A'}</p>
        <p><strong>Last Data update:</strong> {demographics.lastUpdatedYear}</p>
      </div>
    </div>
  );
};
