import React from 'react';

import { ContentfulPage } from '../types/pages';

export const PageProviderContext = React.createContext<ContentfulPage[] | null>(null);

export default PageProviderContext;
