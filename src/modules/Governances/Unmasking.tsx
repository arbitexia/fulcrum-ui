/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useState } from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { UIFlexWrapBox, UIIOSSwitch } from '@/components/UI';
import {
  EntityProperty,
  GovernanceColumnType,
  UnmaskingTableType,
} from '@/types';
import GovernanceTable from './GovernanceTable';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  getAutoUnmaskTopCountSelector,
  getEntityProperties,
  getRemaskAfterDaysSelector,
  getSystemMaskingSelector,
  getUnmaskedTableData,
  setMaskingSystemAutoUnmaskTopCount,
  setNewMasking,
} from '@/redux/slices';
import {
  setMaskingSystemRemaskDays,
  setSystemMaskingStatus,
} from '@/redux/slices/governance.slice';
import { formatKey } from '@/libs/string-utils';
import { NewMaskingStatusParams } from '@/types/governance.type';

const Unmasking = ({ accessToken }: { accessToken: string }): JSX.Element => {
  const dispatch = useAppDispatch();
  const isMasking = useAppSelector(getSystemMaskingSelector);
  const topCountMasking = useAppSelector(getAutoUnmaskTopCountSelector);
  const remaskDaysValue = useAppSelector(getRemaskAfterDaysSelector);
  const unmaskTableData: UnmaskingTableType[] =
    useAppSelector(getUnmaskedTableData);
  const entityPropertyColumns: EntityProperty[] =
    useAppSelector(getEntityProperties);
  const [refresh, setRefresh] = useState<boolean>(false);

  const filteredEntityPropertyColumns: EntityProperty[] = entityPropertyColumns
    ? entityPropertyColumns.filter((entityProperty: EntityProperty) => {
        if (typeof entityProperty === 'string') {
          return entityProperty !== 'name';
        }
        const { propertyName }: { propertyName: string } = entityProperty;
        return propertyName !== 'name';
      })
    : [];

  const convertedEntityPropertyColumns: GovernanceColumnType[] =
    filteredEntityPropertyColumns
      ? filteredEntityPropertyColumns.map((entityProperty: EntityProperty) => {
          if (typeof entityProperty === 'string') {
            const stringEntityProperty: string = entityProperty as string;
            return {
              id: stringEntityProperty,
              headerName: formatKey(stringEntityProperty),
            };
          } else {
            const { propertyName }: { propertyName: string } = entityProperty;
            return {
              id: propertyName,
              headerName: formatKey(propertyName),
            };
          }
        })
      : [];

  const columns: GovernanceColumnType[] = [
    {
      id: 'unmask',
      headerName: 'Unmask',
    },
    {
      id: 'score',
      headerName: 'Score',
      sortable: true,
    },
    {
      id: 'justification',
      headerName: 'Justification',
    },
    {
      id: 'name',
      headerName: 'Name',
    },
    ...convertedEntityPropertyColumns,
  ];

  const setIsMasking = (value: boolean): void => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSystemMaskingStatus({ accessToken, systemMaskingStatus: value })
    );
  };

  const setTopCountMasking = (value: number): void => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMaskingSystemAutoUnmaskTopCount({
        accessToken,
        autoUnmaskCount: value,
      })
    );
  };

  const setMaskingRemaskDays = (value: number): void => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMaskingSystemRemaskDays({ accessToken, remaskingDays: value })
    );
  };

  const unmask = (value: UnmaskingTableType): void => {
    const {
      id: entityId,
      userId,
      justification,
      score,
      modelId,
      scoringInstance,
    } = value;
    const args: NewMaskingStatusParams = {
      accessToken,
      userId: userId as string,
      entityId: entityId as string,
      status: 'approved',
      justification: justification as string,
      lastUpdateDate: Date.now(),
      score: (parseInt(score as string) / 100).toString(),
      modelId: modelId as string,
      scoringInstance: scoringInstance as number,
    };
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setNewMasking(args)
    );
    setRefresh(true);
  };

  return (
    <Box sx={{ padding: '1rem 0' }}>
      <Stack spacing={3}>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Masking
          </Typography>
          <UIIOSSwitch
            checked={isMasking}
            onChange={(event) => setIsMasking(event.target.checked)}
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Auto-unmask top
          </Typography>
          <TextField
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            sx={{
              width: '70px',
              '.MuiInputBase-input': {
                padding: 1,
                color: '#0050BE',
                textAlign: 'center',
              },
            }}
            value={topCountMasking}
            disabled={!isMasking}
            onChange={(event) => {
              const value = parseInt(event.target.value);
              setTopCountMasking(value);
            }}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            individuals
          </Typography>
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Re-mask individuals after
          </Typography>
          <TextField
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            sx={{
              width: '70px',
              '.MuiInputBase-input': {
                padding: 1,
                color: '#0050BE',
                textAlign: 'center',
              },
            }}
            value={remaskDaysValue}
            disabled={!isMasking}
            onChange={(event) => {
              const value = parseInt(event.target.value);
              setMaskingRemaskDays(value);
            }}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            days
          </Typography>
        </UIFlexWrapBox>
        <GovernanceTable
          columns={columns}
          rows={unmaskTableData}
          order="name"
          type="unmask"
          tableRole="checkbox"
          unmaskFunction={unmask}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Stack>
    </Box>
  );
};

export default Unmasking;
