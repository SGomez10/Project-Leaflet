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

// Función auxiliar para formatear números con hasta 2 decimales
const formatNumber = (value: number | null): string => {
  if (value === null) return 'N/A';
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
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
      <div className="basic-info">
        <p><strong>Population:</strong> {population.toLocaleString()}</p>
        <p><strong>Capital:</strong> {capital}</p>
        <p><strong>Continent:</strong> {region}</p>
        <p><strong>Region:</strong> {subregion}</p>
      </div>
      <div className="demographic-info">
        <h3>Demographic Data</h3>
        <p><strong>Birth rate:</strong> {formatNumber(demographics.birthRate)}</p>
        <p><strong>Death rate:</strong> {formatNumber(demographics.deathRate)}</p>
        <p><strong>Life expectancy:</strong> {formatNumber(demographics.lifeExpectancy)}</p>
        <p className="update-info"><strong>Last Data update:</strong> {demographics.lastUpdatedYear}</p>
      </div>
    </div>
  );
};