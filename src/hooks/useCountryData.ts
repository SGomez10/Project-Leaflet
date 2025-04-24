export const useCountryData = () => {
  const fetchCountryData = async (countryName: string) => {
    try {
      // Fetch RESTCountries
      const countryRes = await fetch(
        `https://restcountries.com/v3.1/name/${countryName.toLowerCase().trim()}`
      );
      if (!countryRes.ok) throw new Error("El país que has buscado no existe o no tenemos registros sobre él");
      const countryJson = await countryRes.json();

      const iso3Code = countryJson[0]?.cca3;
      if (!iso3Code) throw new Error("Código ISO3 no encontrado");

      const latlng = countryJson[0].latlng;
      if (!latlng || latlng.length < 2) throw new Error("Coordenadas no encontradas");

      // Fetch OpenAQ for O3 data
      const [latitude, longitude] = latlng;
      const openAQRes = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.openaq.org/v3/measurements?latitude=${latitude}&longitude=${longitude}&parameter=o3`,
        {
          headers: {
            "Authorization": "Bearer 44f8d3b5df4b35d395eae48c96fe077842f5615621738e52894986af9cda0129", // Asegúrate de incluir el token
            "X-Requested-With": "XMLHttpRequest", // Algunos proxies lo requieren
          },
        }
      );
      if (!openAQRes.ok) throw new Error("Error en OpenAQ API");
      const openAQJson = await openAQRes.json();

      const o3Data = openAQJson.results[0];
      if (!o3Data) throw new Error("No se encontraron datos de O3 para este país");

      return {
        countryData: {
          name: countryJson[0].name.common,
          population: countryJson[0].population,
          iso3Code,
          latlng,
        },
        o3Data: {
          value: o3Data.value || 0,
          unit: o3Data.unit || "µg/m³",
          date: o3Data.date?.utc || "N/A",
        },
      };
    } catch (error) {
      throw new Error(`Error al cargar datos: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return { fetchCountryData };
};