/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { wrapper, createStore } from '@/redux/store';
import { AppThemeProvider, AppToastProvider } from '@/providers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const RedVectorApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const store = createStore();
  return (
    <AppThemeProvider>
      <AppToastProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
              <Component {...pageProps} />
            </PersistGate>
          </Provider>
        </LocalizationProvider>
      </AppToastProvider>
    </AppThemeProvider>
  );
};

export default wrapper.withRedux(RedVectorApp);
