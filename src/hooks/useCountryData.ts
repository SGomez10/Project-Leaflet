export interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  value: number | null;
  date: string;
}

export interface DemographicData {
  birthRate: number | null;
  deathRate: number | null;
  lifeExpectancy: number | null;
  lastUpdatedYear: string;
}

export interface CountryData {
  name: string;
  population: number;
  iso3Code: string;
  capital: string;
  region: string;
  subregion: string;
  latlng: [number, number];
}

export const useCountryData = () => {
  const fetchCountryData = async (countryName: string) => {
    try {
      // 1. Obtener datos básicos del país de RESTCountries
      const countryRes = await fetch(
        `https://restcountries.com/v3.1/name/${countryName.toLowerCase().trim()}`
      );
      if (!countryRes.ok) throw new Error("El país que has buscado no existe o no tenemos registros sobre él");
      const countryJson = await countryRes.json();

      const iso3Code = countryJson[0]?.cca3;
      if (!iso3Code) throw new Error("Código ISO3 no encontrado");

      const latlng = countryJson[0].latlng;
      if (!latlng || latlng.length < 2) throw new Error("Coordenadas no encontradas");

      // 2. Mapear códigos ISO3 para World Bank (v2 tiene algunas diferencias)
      const wbCountryCode = getWorldBankCountryCode(iso3Code);

      // 3. Obtener datos demográficos de World Bank API v2 de manera individual
      const demographicData = await fetchDemographicsData(wbCountryCode);

      // 4. Estructurar la respuesta final
      return {
        countryData: {
          name: countryJson[0].name.common,
          population: countryJson[0].population,
          iso3Code,
          capital: countryJson[0].capital?.[0] || "No disponible",
          region: countryJson[0].region || "No disponible",
          subregion: countryJson[0].subregion || "No disponible",
          latlng
        },
        demographics: demographicData
      };

    } catch (error) {
      throw new Error(`Error al cargar datos: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return { fetchCountryData };
};

// Función para mapear códigos ISO3 a los usados por World Bank v2
const getWorldBankCountryCode = (iso3Code: string): string => {
  const exceptions: Record<string, string> = {
    ROU: 'ROM',    // Rumanía
    COD: 'ZAR',    // República Democrática del Congo
    TLS: 'TMP',    // Timor-Leste
    SSD: 'SDS'     // Sudán del Sur
  };
  return exceptions[iso3Code] || iso3Code;
};

// Función para obtener los datos demográficos de World Bank
const fetchDemographicsData = async (countryCode: string): Promise<DemographicData> => {
  try {
    // Obtener la tasa de natalidad
    const birthRateRes = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.DYN.CBRT.IN?format=json`
    );
    if (!birthRateRes.ok) throw new Error(`Error al obtener tasa de natalidad: ${birthRateRes.statusText}`);
    const birthRateData = await birthRateRes.json();
    console.log("Tasa de natalidad:", birthRateData); // Verificar la respuesta

    // Obtener la tasa de mortalidad
    const deathRateRes = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.DYN.CDRT.IN?format=json`
    );
    if (!deathRateRes.ok) throw new Error(`Error al obtener tasa de mortalidad: ${deathRateRes.statusText}`);
    const deathRateData = await deathRateRes.json();
    console.log("Tasa de mortalidad:", deathRateData); // Verificar la respuesta

    // Obtener la esperanza de vida
    const lifeExpectancyRes = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.DYN.LE00.IN?format=json`
    );
    if (!lifeExpectancyRes.ok) throw new Error(`Error al obtener esperanza de vida: ${lifeExpectancyRes.statusText}`);
    const lifeExpectancyData = await lifeExpectancyRes.json();
    console.log("Esperanza de vida:", lifeExpectancyData); // Verificar la respuesta

    // Función para buscar el primer valor no nulo
    const getValidValue = (data: any[]): number | null => {
      const validData = data.find(item => item.value !== null);
      return validData ? validData.value : null;
    };

    // Buscar el primer valor válido (no nulo)
    const birthRate = getValidValue(birthRateData[1]) ?? getValidValue(birthRateData[0]);
    const deathRate = getValidValue(deathRateData[1]) ?? getValidValue(deathRateData[0]);
    const lifeExpectancy = getValidValue(lifeExpectancyData[1]) ?? getValidValue(lifeExpectancyData[0]);

    // Verificar si los datos están disponibles y usar un valor por defecto si es necesario
    const lastUpdatedYear = birthRateData[1]?.[0]?.date || 'N/A';  // Última fecha de actualización

    return {
      birthRate,
      deathRate,
      lifeExpectancy,
      lastUpdatedYear
    };

  } catch (error) {
    console.error("Error al obtener los datos demográficos de World Bank", error);
    throw new Error(`Error al cargar datos demográficos: ${error instanceof Error ? error.message : String(error)}`);
  }
};



