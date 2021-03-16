import { createContext } from 'react';
import DataLoader from './DataLoader';


const dataLoaderContext = createContext<DataLoader | undefined>(undefined);

export default dataLoaderContext;