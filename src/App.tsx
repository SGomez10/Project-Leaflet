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
      capital: string;
      region: string;
      subregion: string;
      latlng: [number, number];
    };
    demographics: {
      birthRate: number | null;
      deathRate: number | null;
      lifeExpectancy: number | null;
      lastUpdatedYear: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchCountryData } = useCountryData();

  const handleSearch = async () => {
    if (!countryName.trim()) {
      setError('Por favor ingresa un nombre de país');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCountryData(null);

    try {
      const normalizedName = countryName.trim().toLowerCase();
      const data = await fetchCountryData(normalizedName);
      setCountryData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al buscar el país';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Explorador de Datos Demográficos</h1>
        <p className="subtitle">Consulta información detallada de cualquier país</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          placeholder="Ej: España, México, Japón..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          disabled={isLoading}
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? (
            <span className="loading-text">Buscando...</span>
          ) : (
            <span>Buscar</span>
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span role="img" aria-label="Error">⚠️</span> {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <span className="spinner" role="status" aria-label="Cargando"></span>
          Cargando datos del país...
        </div>
      )}

      {countryData && !isLoading && (
        <div className="data-container">
          <CountryInfo
            name={countryData.countryData.name}
            population={countryData.countryData.population}
            capital={countryData.countryData.capital}
            region={countryData.countryData.region}
            subregion={countryData.countryData.subregion}
            demographics={countryData.demographics}
          />
          
          <div className="map-wrapper">
            <MapView
              latlng={countryData.countryData.latlng}
              countryName={countryData.countryData.name}
            />
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>Datos proporcionados por REST Countries y World Bank API</p>
      </footer>
    </div>
  );
}

export default App;