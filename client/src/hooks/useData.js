import { useDataStore } from '../store/dataStore';

export const useData = () => {
  const store = useDataStore();
  return store;
};
