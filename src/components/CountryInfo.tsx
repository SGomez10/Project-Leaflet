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
      <p><strong>Población:</strong> {population.toLocaleString()}</p>
      <p><strong>Capital:</strong> {capital}</p>
      <p><strong>Región:</strong> {region}</p>
      <p><strong>Subregión:</strong> {subregion}</p>
      <div className="demographics">
        <h3>Datos Demográficos</h3>
        <p><strong>Tasa de natalidad:</strong> {demographics.birthRate ?? 'N/A'}</p>
        <p><strong>Tasa de mortalidad:</strong> {demographics.deathRate ?? 'N/A'}</p>
        <p><strong>Esperanza de vida:</strong> {demographics.lifeExpectancy ?? 'N/A'}</p>
        <p><strong>Última actualización:</strong> {demographics.lastUpdatedYear}</p>
      </div>
    </div>
  );
};
