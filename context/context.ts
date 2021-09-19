import React from 'react';
import { CommerceLayerClient } from '@commercelayer/sdk';

export const AuthProviderContext = React.createContext<CommerceLayerClient | null>(null);

export default AuthProviderContext;
