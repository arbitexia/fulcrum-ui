/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  retrieveExternalData,
  getExternalDataSelector,
  saveExternalData,
} from '@/redux/slices';
import {
  Box,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Collapse,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  UIDefaultTextField,
  UIFlexSpaceBox,
  UIFlexWrapBox,
  UISelect,
} from '@/components/UI';
import { ExternalApplication, NewExternalParams } from '@/types';
import { Close } from '@mui/icons-material';
import { StyledAddButton, StyledActionDialog, StyledSendButton } from './ui';
import {
  externalAppData,
  externalAppDescriptionData,
} from '@/_mock/models.mock';
import { format, addHours } from 'date-fns';
import { stableSort } from '@/libs/sort-utils';

export const ActionModal = ({
  open,
  onClose,
  entityName,
}: {
  open: boolean;
  onClose: () => void;
  entityName: string;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { query, isReady } = router;
  const { id: entityId = '' } = query as { id: string };
  const [extApp, setExtApp] = useState<string>('iam');
  const [description, setDescription] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [actionTime, setActionTime] = useState<string>('');
  const externals: ExternalApplication[] =
    useAppSelector(getExternalDataSelector) || null;
  const [externalData, setExternalData] =
    useState<ExternalApplication[]>(externals);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  type Order = 'asc' | 'desc';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ExternalApplication>('name');

  const dispatchSave = (args: NewExternalParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        saveExternalData(args)
      );
      resolve();
    });
  };

  const onSave = (): void => {
    const newItem = {
      id: 'NEW',
      name: extApp,
      description,
      action,
      actionTime,
    };
    const externalJson = JSON.stringify(newItem);
    dispatchSave({
      accessToken: 'abc123',
      externalJson,
      author: 'Diego Martinez',
      lastUpdateDate: Date.now(),
    }).then(() =>
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveExternalData({
          accessToken: 'abc123',
          entityId,
        })
      )
    );
  };

  useEffect(() => {
    if (isReady && entityId) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveExternalData({
          accessToken: 'abc123',
          entityId,
        })
      );
    }
  }, [dispatch, isReady, entityId]);

  useEffect(() => {
    setExternalData(externals);
  }, [externals, setExternalData]);

  const descendingComparator = (
    a: ExternalApplication,
    b: ExternalApplication,
    comparatorOrderBy: keyof ExternalApplication
  ): number => {
    if (
      a != null &&
      b != null &&
      comparatorOrderBy != null &&
      b[comparatorOrderBy] &&
      a[comparatorOrderBy]
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (b[comparatorOrderBy] < a[comparatorOrderBy]) {
        return -1;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (b[comparatorOrderBy] > a[comparatorOrderBy]) {
        return 1;
      }
    }
    return 0;
  };

  const getComparator = <Key extends keyof ExternalApplication>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((a: ExternalApplication, b: ExternalApplication) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ExternalApplication
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof ExternalApplication) =>
    (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleExtAppChange = (e: SelectChangeEvent<unknown>): void => {
    setExtApp(e.target.value as string);
  };
  const handleDescriptionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setDescription(e.currentTarget.value as string);
  };
  const handleActionChange = (e: SelectChangeEvent<unknown>): void => {
    setAction(e.target.value as string);
  };
  const handleActionTimeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setActionTime(e.currentTarget.value as string);
  };
  const onCloseDialog = (): void => {
    setIsEdit(false);
    onClose();
  };

  return (
    <StyledActionDialog
      open={open}
      onClose={onCloseDialog}
      BackdropProps={{ invisible: true }}
    >
      <Box sx={{ m: 0, p: 2, background: '#ECEFF1' }}>
        <UIFlexSpaceBox>
          <Box
            sx={{
              fontWeight: '400',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#39474E',
              span: {
                fontWeight: 700,
              },
            }}
          >
            Send Actions for <span>{entityName}</span>
          </Box>
          <UIFlexWrapBox sx={{ gap: '30px' }}>
            <StyledAddButton onClick={() => setIsEdit(true)}>
              Add New
            </StyledAddButton>
            <IconButton
              aria-label="close"
              onClick={onCloseDialog}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </UIFlexWrapBox>
        </UIFlexSpaceBox>
        <Collapse in={isEdit} timeout="auto" unmountOnExit>
          <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
            <Box>
              <Typography sx={{ fontSize: 13, color: '#504F54' }}>
                External Application
              </Typography>
              <UISelect
                height="36px"
                itemList={externalAppData}
                defaultValue={'iam'}
                value={extApp}
                handleChange={handleExtAppChange}
                width="254px"
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: '#504F54' }}>
                Description
              </Typography>
              <UIDefaultTextField
                variant="standard"
                sx={{ width: '198px' }}
                defaultValue={description}
                onChange={handleDescriptionChange}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: '#504F54' }}>
                Action
              </Typography>
              <UISelect
                height="36px"
                itemList={externalAppData}
                defaultValue={'iam'}
                value={action}
                handleChange={handleActionChange}
                width="236px"
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: '#504F54' }}>
                How Long(hour)?
              </Typography>
              <UIDefaultTextField
                variant="standard"
                defaultValue={actionTime}
                sx={{ width: '115px' }}
                onChange={handleActionTimeChange}
              />
            </Box>
            <StyledSendButton onClick={onSave}>Send</StyledSendButton>
          </UIFlexSpaceBox>
        </Collapse>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={order}
                  onClick={createSortHandler('name')}
                >
                  External Application
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'analyst'}
                  direction={order}
                  onClick={createSortHandler('analyst')}
                >
                  Analyst
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'actionTime'}
                  direction={order}
                  onClick={createSortHandler('actionTime')}
                >
                  Action Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={order}
                  onClick={createSortHandler('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {externalData &&
              externalData.length > 0 &&
              stableSort<ExternalApplication>(
                externalData,
                getComparator(order, orderBy)
              ).map(([row, _], index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#504F54',
                      width: '300px',
                    }}
                  >
                    {externalAppDescriptionData[row.name]}
                  </TableCell>
                  <TableCell sx={{ width: '250px' }}>
                    {row.description}
                  </TableCell>
                  <TableCell>{row.analyst}</TableCell>
                  <TableCell align="center">
                    {format(
                      addHours(
                        new Date(row.createdAt),
                        parseInt(row.actionTime)
                      ),
                      'MM/dd/yyyy HH:mm aa'
                    )}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </StyledActionDialog>
  );
};
