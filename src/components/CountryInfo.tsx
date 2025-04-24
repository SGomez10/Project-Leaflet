interface CountryInfoProps {
  name: string;
  population: number;
  o3Value: number;
  o3Unit: string;
  o3Date: string;
}

export const CountryInfo = ({ name, population, o3Value, o3Unit, o3Date }: CountryInfoProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Población: {population.toLocaleString()}</p>
      <p>Emisiones O3: {o3Value} {o3Unit} (Fecha: {o3Date})</p>
    </div>
  );
};