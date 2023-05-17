/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  UIContainer,
  UIProfilePagination,
  UISelectBox,
  UISelectItem,
  UIFlexCenterBox,
  UIFlexSpaceBox,
} from '@/components/UI';
import { StyledHeader } from './ui';
import { stableSort } from '@/libs/sort-utils';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  basisReportSelector,
  getDataSourcesConfigInitialized,
  getDataSourcesSelect,
  getSelectedModelId,
  getAccessToken,
  getAttributeDataSourceIdSelector,
  scoringPageInfoSelector,
  getSelectedStats,
  changeLimit,
  changePageNumber,
  changeDataSourceId,
  isScoringStatusFailed,
  isEntityStatusPending,
  retrieveBasis,
  retrieveBasisCount,
  isScoringReportInitializedSelector,
  getAllCursorsByPageNumber,
} from '@/redux/slices';
import {
  PaginateParam,
  PaginationState,
  RetrieveBasisParams,
  ScoreBasisResult,
} from '@/types';
import { Stats } from '@/types/stats.type';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { formatKey } from '@/libs/string-utils';
import {
  BasisPropertyType,
  RetrieveBasisCountParams,
} from '@/types/scoring.type';
import {
  getIsScoringCountInitialized,
  getScoringCount,
} from '@/redux/slices/scoring.slice';

const UserDetailBasisView = ({
  entityId,
  attributeId,
  isDataSourceChanged,
}: {
  entityId: string;
  attributeId: string;
  isDataSourceChanged: boolean;
}): JSX.Element => {
  type Order = 'asc' | 'desc';
  const dispatch = useAppDispatch();
  const modelId: string = useAppSelector(getSelectedModelId);
  const modelStats: Stats = useAppSelector(getSelectedStats);
  const selectedBasisData: BasisPropertyType[] =
    useAppSelector(basisReportSelector);
  const selectBasisPageInfo: PaginateParam = useAppSelector(
    scoringPageInfoSelector('basis')
  );
  const scoringCount = useAppSelector(getScoringCount);
  const isBasisReportInitialized: boolean = useAppSelector(
    isScoringReportInitializedSelector
  );
  const isScoringCountInitialized = useAppSelector(
    getIsScoringCountInitialized
  );
  const cursorsByPageNumber: { [pageNumber: number]: PaginationState } =
    useAppSelector(getAllCursorsByPageNumber);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof BasisPropertyType>('id');
  const [basisData, setBasisData] = useState<BasisPropertyType[] | null>(null);
  const [basisKeys, setBasisKeys] = useState<
    (keyof BasisPropertyType)[] | null
  >(null);
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const basisDataSourceId: string = useAppSelector(
    getAttributeDataSourceIdSelector(attributeId)
  );
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateAccessToken = useAppSelector(getAccessToken);
  const isScoringStatusFailedValue = useAppSelector(isScoringStatusFailed);
  const isEntityStatusPendingValue = useAppSelector(isEntityStatusPending);

  const [dataSourceId, setDataSourceId] = useState<string>('');
  const [cursor, setCursor] = useState<string>(
    selectBasisPageInfo?.beginCursor ?? ''
  );
  const [limit, setLimit] = useState<number>(selectBasisPageInfo.limit ?? 25);
  const [pageNumber, setPageNumber] = useState<number>(
    selectBasisPageInfo?.pageNumber ?? 1
  );

  useEffect(() => {
    const isCursorChanged =
      selectBasisPageInfo && selectBasisPageInfo.beginCursor !== cursor;
    const isLimitChanged =
      selectBasisPageInfo && selectBasisPageInfo.limit !== limit;
    const isPageNumberChanged =
      selectBasisPageInfo && selectBasisPageInfo.pageNumber !== pageNumber;
    const hasChanges = isCursorChanged || isLimitChanged || isPageNumberChanged;
    if (selectBasisPageInfo && hasChanges) {
      setCursor(selectBasisPageInfo.beginCursor ?? '');
      setLimit(selectBasisPageInfo.limit ?? 25);
      setPageNumber(selectBasisPageInfo.pageNumber ?? 1);
    }
  }, [selectBasisPageInfo, cursor, limit, pageNumber]);

  const dispatchChangeLimit = (newLimit: number): void => {
    dispatch(changeLimit({ limit: newLimit }));
  };

  const dispatchChangePageNumber = (newPageNumber: number): void => {
    dispatch(changePageNumber({ pageNumber: newPageNumber }));
  };

  const dispatchChangeDataSourceId = useCallback(
    (newDataSourceId: string): void => {
      dispatch(changeDataSourceId({ dataSourceId: newDataSourceId }));
    },
    [dispatch]
  );

  const dispatchRetrieveBasisPromise = useCallback(
    (args: RetrieveBasisParams): Promise<unknown> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          retrieveBasis(args)
        );
        resolve();
      });
    },
    [dispatch]
  );

  const dispatchRetrieveScoresCountPromise = useCallback(
    (args: RetrieveBasisCountParams): Promise<unknown> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          retrieveBasisCount(args)
        );
        resolve();
      });
    },
    [dispatch]
  );

  const dispatchRetrieveBasis = useCallback(
    ({
      dispatchModelId,
      dispatchModelStats,
      dispatchEntityId,
      dispatchDataSourceId,
      dispatchCursor,
      dispatchLimit,
    }: {
      dispatchModelId: string;
      dispatchModelStats: Stats;
      dispatchEntityId: string;
      dispatchDataSourceId: string;
      dispatchCursor: string;
      dispatchLimit: number;
    }): void => {
      if (stateAccessToken) {
        const args = {
          accessToken: stateAccessToken,
          entityId: dispatchEntityId,
          dataSourceId: dispatchDataSourceId,
          modelId: dispatchModelId,
          modelInstance: dispatchModelStats ? dispatchModelStats.instance : 0,
          cursor: dispatchCursor,
          pageNumber,
          limit: dispatchLimit,
        };
        dispatchRetrieveBasisPromise(args).then(() => {
          if (!isScoringCountInitialized) {
            dispatchRetrieveScoresCountPromise(args);
          }
        });
      }
    },
    [
      stateAccessToken,
      pageNumber,
      dispatchRetrieveBasisPromise,
      dispatchRetrieveScoresCountPromise,
      isScoringCountInitialized,
    ]
  );

  useEffect(() => {
    if (stateResourceData.length > 0 && 'id' in stateResourceData[0]) {
      setDataSourceId(stateResourceData[0].id);
    } else {
      setDataSourceId('');
    }
  }, [stateResourceData]);

  useEffect(() => {
    if (
      !isBasisReportInitialized &&
      !isScoringStatusFailedValue &&
      !isEntityStatusPendingValue &&
      modelId &&
      modelStats &&
      entityId &&
      dataSourceId
    ) {
      const usePageNumber = selectBasisPageInfo?.pageNumber ?? 1;
      const cursorByPageNumber =
        cursorsByPageNumber[usePageNumber]?.beginCursor ?? '';
      const useCursor = usePageNumber === 1 ? '' : cursorByPageNumber ?? '';
      dispatchRetrieveBasis({
        dispatchModelId: modelId,
        dispatchModelStats: modelStats,
        dispatchEntityId: entityId,
        dispatchDataSourceId: dataSourceId,
        dispatchCursor: useCursor,
        dispatchLimit: limit,
      });
    }
  }, [
    isBasisReportInitialized,
    selectBasisPageInfo,
    modelId,
    entityId,
    dataSourceId,
    modelStats,
    dispatchRetrieveBasis,
    cursor,
    limit,
    pageNumber,
    isScoringStatusFailedValue,
    isEntityStatusPendingValue,
    cursorsByPageNumber,
  ]);

  useEffect(() => {
    setBasisData(selectedBasisData);
    const activeBasisKeys: Set<keyof BasisPropertyType> = new Set<
      keyof ScoreBasisResult
    >([]);
    selectedBasisData.forEach((basisResultObject: BasisPropertyType) => {
      const objectKeys: (keyof BasisPropertyType)[] = Object.keys(
        basisResultObject
      ) as (keyof BasisPropertyType)[];
      objectKeys.forEach((key: keyof BasisPropertyType) => {
        if (
          key in basisResultObject &&
          basisResultObject != null &&
          !activeBasisKeys.has(key)
        ) {
          activeBasisKeys.add(key);
        }
      });
    });
    const sortedArray = Array.from(activeBasisKeys).sort();
    const idIndex = sortedArray.indexOf('id');
    if (idIndex > 0) {
      const idFirstArray = [
        sortedArray[idIndex],
        ...sortedArray.slice(0, idIndex),
        ...sortedArray.slice(idIndex + 1),
      ];
      setBasisKeys(idFirstArray);
    } else {
      setBasisKeys(sortedArray);
    }
  }, [selectedBasisData]);

  useEffect(() => {
    if (basisDataSourceId && isDataSourceChanged) {
      setDataSourceId(basisDataSourceId);
      dispatchChangeDataSourceId(basisDataSourceId);
    }
  }, [
    basisDataSourceId,
    cursor,
    entityId,
    limit,
    modelId,
    modelStats,
    isDataSourceChanged,
    dispatchChangeDataSourceId,
  ]);

  const descendingComparator = (
    a: BasisPropertyType,
    b: BasisPropertyType,
    comparatorOrderBy: keyof BasisPropertyType
  ): number => {
    if (
      a != null &&
      b != null &&
      comparatorOrderBy != null &&
      a[comparatorOrderBy] &&
      b[comparatorOrderBy]
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

  const getComparator = <Key extends keyof BasisPropertyType>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((a: BasisPropertyType, b: BasisPropertyType) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof BasisPropertyType
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof BasisPropertyType) =>
    (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleSelectChange = (event: SelectChangeEvent<unknown>): void => {
    const dataSourceValue = (event.target.value as string) || null;
    if (dataSourceValue) {
      setDataSourceId(dataSourceValue);
      dispatchChangeDataSourceId(dataSourceValue);
    }
  };

  if (!stateResourceData || !isDataSourceConfigInitialized) {
    return <LinearProgress />;
  }

  const useLimit = selectBasisPageInfo?.limit ?? 25;
  const usePageNumber = selectBasisPageInfo?.pageNumber ?? 25;
  const useScoringCount = scoringCount ?? 0;
  const maxPageNumber = Math.ceil(useScoringCount / useLimit);

  return (
    <Box sx={{ background: '#FFFFFF' }}>
      <UIContainer>
        <StyledHeader>Basis for the Risk</StyledHeader>
        <UIFlexSpaceBox
          sx={{
            gap: 2,
            marginTop: '30px',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#39474E',
            alignItems: 'center',
          }}
        >
          <UIFlexCenterBox>
            <UIFlexCenterBox>
              DataSource
              <UISelectBox
                id="demo-simple-select-helper"
                defaultValue={stateResourceData[0].id}
                label="status"
                value={dataSourceId}
                onChange={handleSelectChange}
                textColor="#39474E"
                width="200px"
                height="36px"
              >
                {stateResourceData.map((item, index) => {
                  return (
                    <UISelectItem key={index} value={item.id}>
                      {item.name}
                    </UISelectItem>
                  );
                })}
              </UISelectBox>
            </UIFlexCenterBox>
            <UIFlexCenterBox sx={{ gap: 0 }}>
              <Checkbox sx={{ width: '32px', height: '32px' }} />
              Show all data
            </UIFlexCenterBox>
            <UIFlexCenterBox sx={{ marginLeft: '40px' }}>
              <UIProfilePagination
                pageNumber={usePageNumber}
                pageCount={maxPageNumber}
                limit={useLimit}
                onChange={(v) => {
                  setLimit(v);
                  dispatchChangeLimit(v);
                }}
                onNext={() => {
                  if (usePageNumber < maxPageNumber) {
                    dispatchChangePageNumber(pageNumber + 1);
                  }
                }}
                onPrev={() => {
                  if (usePageNumber > 1) {
                    dispatchChangePageNumber(pageNumber - 1);
                  }
                }}
                width="324px"
              />
            </UIFlexCenterBox>
          </UIFlexCenterBox>
          <UIFlexCenterBox>
            Total Record Count: {useScoringCount}
          </UIFlexCenterBox>
          <UIFlexCenterBox>
            <IconButton>
              <Image
                src={'images/icons/xls.svg'}
                loader={appImageLoader}
                width={24}
                height={30}
                alt="pdf"
              />
            </IconButton>
            <IconButton>
              <Image
                src={'images/icons/settings.svg'}
                loader={appImageLoader}
                width={24}
                height={24}
                alt="pdf"
              />
            </IconButton>
          </UIFlexCenterBox>
        </UIFlexSpaceBox>
        <Box sx={{ marginTop: '20px' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {basisKeys &&
                  basisKeys.map((key: keyof BasisPropertyType) => {
                    const formattedKey: string = formatKey(key as string, [
                      'id',
                      'pc',
                    ]);
                    return (
                      <TableCell
                        align="center"
                        width="250px"
                        key={`${key}-header`}
                      >
                        <TableSortLabel
                          active={orderBy === key}
                          direction={order}
                          onClick={createSortHandler(key)}
                        >
                          {formattedKey}
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {basisData &&
                stableSort<BasisPropertyType>(
                  basisData,
                  getComparator(order, orderBy)
                ).map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ borderBottom: '1px solid #ECEFF1' }}
                  >
                    {basisKeys &&
                      basisKeys.map((key: keyof BasisPropertyType, index) => {
                        const value = row[key] ?? '';
                        return (
                          <TableCell
                            align="center"
                            height="48px"
                            width="250px"
                            key={`${key}-${index}-value`}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </UIContainer>
    </Box>
  );
};

export default UserDetailBasisView;
