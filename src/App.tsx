import { useState } from 'react';
import { useCountryData } from './hooks/useCountryData';
import { MapView } from './components/MapView';
import { CountryInfo } from './components/CountryInfo';
import './App.css';

function App() {
  const [countryName, setCountryName] = useState('Spain');
  const [countryData, setCountryData] = useState<{
    countryData: {
      name: string;
      population: number;
      iso3Code: string;
      latlng: [number, number];
    };
    o3Data: {
      value: number;
      unit: string;
      date: string;
    };
  } | null>(null);

  const { fetchCountryData } = useCountryData();

  const handleSearch = async () => {
    try {
      const normalizedName = countryName.trim().toLowerCase();
      const data = await fetchCountryData(normalizedName);
      
      setCountryData(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  return (
    <div className="App">
      <h1>Datos de Población y O₃ por País</h1>
      <div className="search-container">
        <input
          type="text"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          placeholder="Ej: Mexico, Germany..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {countryData && (
        <div className="data-container">
          <CountryInfo
            name={countryData.countryData.name}
            population={countryData.countryData.population}
            o3Value={countryData.o3Data.value}
            o3Unit={countryData.o3Data.unit}
            o3Date={countryData.o3Data.date}
          />
          <div className="map-wrapper">
            <MapView
              latlng={countryData.countryData.latlng}
              countryName={countryData.countryData.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;