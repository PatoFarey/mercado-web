export interface Config {
  useApi: boolean;
  apiUrl: string;
}

const config: Config = {
  useApi: false, // Set to true to use API, false to use local JSON
  apiUrl: 'http://localhost:3000/api/anuncios'
};

export default config;