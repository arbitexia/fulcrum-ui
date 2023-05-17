/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, createContext, ReactNode, Context } from 'react';
import { AlertColor } from '@mui/material';
import { AppToast } from '@/components/App';

type ToastContextType = {
  severity?: AlertColor | null;
  message?: string | null;
};

const AppToastContext = createContext<any>(null);
AppToastContext.displayName = `AppToastContext`;

interface AppToastProviderProps {
  children: ReactNode | ReactNode[];
}

const AppToastProvider = ({
  children,
  ...rest
}: AppToastProviderProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const value = ({
    severity: inputSeverity,
    message: inputMessage,
  }: ToastContextType): void => {
    setOpen(true);
    setMessage(inputMessage || '');
    setSeverity(inputSeverity || 'success');
  };

  return (
    <AppToastContext.Provider value={value} {...rest}>
      <AppToast
        open={open}
        message={message}
        severity={severity}
        onClose={() => setOpen(false)}
        onClickAway={() => setOpen(false)}
      />
      {children}
    </AppToastContext.Provider>
  );
};

const useAppToast = (): Context<ReactNode> => useContext(AppToastContext);

export { AppToastProvider, useAppToast };
