import { useContext } from 'react';
import dataLoaderContext from './context';


const useDataLoader = () => {
  const context = useContext(dataLoaderContext);
  if (context === undefined) {
    throw new Error('useDataLoaderContext must be used within DataLoaderProvider');
  }

  console.log('DataLoader in use');

  return "";
} 

export default useDataLoader;