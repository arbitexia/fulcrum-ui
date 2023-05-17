/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  UIContainer,
  UIDefaultTextField,
  UIDefaultButton,
  UIDefaultSwitch,
  UIFlexSpaceBox,
} from '@/components/UI';
import { Typography, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAppToast } from '@/providers';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  toggleScoringMode,
  getIsScoringPaused,
  fullRun,
} from '@/redux/slices/control.slice';

const ModelsNavbar = ({
  url,
  action,
  id,
  onActionClick,
}: {
  url: string;
  action: string;
  id: string;
  onActionClick: (url: string, action: string, id: number | string) => void;
}): JSX.Element => {
  const appToast = useAppToast();
  const dispatch = useAppDispatch();
  const isScoringPaused = useAppSelector(getIsScoringPaused);
  const [checked, setChecked] = useState<boolean>(isScoringPaused);

  const handleScoringChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setChecked(e.target.checked);
    if (!e.target.checked) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(fullRun({}));
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dispatch(toggleScoringMode());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    appToast({ severity: 'success', message: 'Control Scoring Mode Changed' });
  };

  useEffect(() => {
    setChecked(isScoringPaused);
  }, [isScoringPaused, dispatch]);

  return (
    <UIContainer>
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
        <Typography variant="h4" sx={{ mr: 4 }}>
          Model and Scoring Configuration
        </Typography>
        <UIFlexSpaceBox sx={{ gap: 2 }}>
          <UIDefaultButton onClick={() => onActionClick(url, action, id)}>
            Add New
          </UIDefaultButton>
          <UIDefaultTextField
            id="input-with-icon-textfield"
            placeholder="Filter List"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
            sx={{ input: { color: '#2E2C34' } }}
          />
        </UIFlexSpaceBox>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
        <Typography variant="h4" sx={{ mr: 4 }}></Typography>
        <UIFlexSpaceBox sx={{ gap: 2 }}>
          <Typography variant="h4" sx={{ mr: 4 }}>
            Pause All Scoring
          </Typography>
          <UIDefaultSwitch checked={checked} onChange={handleScoringChange} />
        </UIFlexSpaceBox>
      </UIFlexSpaceBox>
    </UIContainer>
  );
};

export default ModelsNavbar;
