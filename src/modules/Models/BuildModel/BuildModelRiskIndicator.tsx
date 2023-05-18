/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  MoreHoriz,
  AddCircleOutline,
} from '@mui/icons-material';
import { UIFlexWrapBox, UISelect } from '@/components/UI';
import { RiskIndicatorType } from '@/types';
import attributeTypeToComponent, {
  riskIndicatorFunctionType,
} from '@/modules/Models/BuildRisk/RiskIndicatorByAttributeType';
import { IconButton, Typography, Box, Collapse } from '@mui/material';
import { roundScore } from '@/libs/math-utils';
import { UISelectInterface } from '@/types/common.type';
import { riskValues } from '@/_mock/models.mock';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import {
  getDataSourcesConfigInitialized,
  getListIds,
  modelValueChangeHandler,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { RiskIndicatorModelType } from '@/types/models.type';
import { noop } from 'lodash';

const BuildModelRiskIndicator = ({
  indicator,
  modelRiskIndicator,
  riskIndicatorsList = [],
  dataSources = [],
  riskFields = {},
  setOpenWeightChange,
  categoryIndex,
  index,
  modelId,
}: {
  indicator: RiskIndicatorType | null;
  modelRiskIndicator: RiskIndicatorModelType | null;
  riskIndicatorsList?: UISelectInterface[] | null;
  dataSources?: UISelectInterface[] | null;
  riskFields?: { [dataSource: string]: UISelectInterface[] } | null;
  setOpenWeightChange?: () => void;
  categoryIndex: number;
  index: number;
  modelId: string;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const lists = useAppSelector(getListIds);
  const [openCollapse, setOpenCollapse] = useState<boolean>(false);
  const [viewIcons, setViewIcons] = useState<boolean>(false);
  const componentFn: riskIndicatorFunctionType | null =
    (indicator &&
      indicator.attributeType &&
      attributeTypeToComponent(indicator.attributeType)) ||
    null;
  const canDisplayComponent =
    componentFn &&
    indicator &&
    isDataSourceConfigInitialized &&
    dataSources &&
    riskFields;
  const riskIndicatorValue = riskIndicatorsList
    ? riskIndicatorsList.find((ri) => ri.name === indicator?.name)
    : null;
  const riskIndicatorId = riskIndicatorValue ? riskIndicatorValue.id : -1;

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    {
      operation,
      targetId,
      categoryListIndex,
      riskIndicatorListIndex,
    }: {
      operation: string;
      targetId: string | null;
      categoryListIndex?: number | undefined;
      riskIndicatorListIndex?: number | undefined;
    }
  ): void => {
    if (targetId) {
      dispatch(
        modelValueChangeHandler({
          operation,
          id: targetId,
          categoryListIndex,
          riskIndicatorListIndex,
        })
      );
    }
  };
  const handleSelectChange = (
    event: SelectChangeEvent<unknown>,
    {
      operation,
      targetId,
      categoryListIndex,
      riskIndicatorListIndex,
    }: {
      operation: string;
      targetId: string | null;
      categoryListIndex?: number | undefined;
      riskIndicatorListIndex?: number | undefined;
    }
  ): void => {
    const value = event.target.value || null;

    if (operation && targetId && value) {
      dispatch(
        modelValueChangeHandler({
          operation,
          id: targetId,
          value,
          categoryListIndex,
          riskIndicatorListIndex,
        })
      );
    }
  };

  const toggleViewIcons = (): void => {
    setViewIcons((prevState) => {
      return !prevState;
    });
  };

  return (
    <Box sx={{ mt: 2.5 }}>
      <UIFlexWrapBox
        sx={{
          marginLeft: '80px',
          alignItems: 'center',
          fontWeight: '400',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#504F54',
          py: '6px',
          gap: '16px',
        }}
      >
        <IconButton
          onClick={() => setOpenCollapse(!openCollapse)}
          sx={{ padding: 0 }}
        >
          {openCollapse ? (
            <KeyboardArrowDown
              sx={{ color: '#647C8A', width: '20px', height: '20px' }}
            />
          ) : (
            <KeyboardArrowRight
              sx={{ color: '#647C8A', width: '20px', height: '20px' }}
            />
          )}
        </IconButton>
        Risk Indicator
        <Box />
        <UISelect
          placeholder={
            <Typography
              sx={{
                fontStyle: 'italic',
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: 'grey',
              }}
            >
              Select
            </Typography>
          }
          defaultValue={riskIndicatorId}
          value={riskIndicatorId || -1}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeRiskIndicatorIdInCategory',
              targetId: modelId,
              categoryListIndex: categoryIndex,
              riskIndicatorListIndex: index,
            })
          }
          itemList={riskIndicatorsList || []}
          width="288px"
          height="36px"
        />
        Weight
        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '20px',
            color: '#0050BE',
            cursor: 'pointer',
          }}
          onClick={setOpenWeightChange}
        >
          {modelRiskIndicator?.weight
            ? roundScore(modelRiskIndicator?.weight || 0)
            : 0}
          %
        </Typography>
        <MoreHoriz
          onClick={toggleViewIcons}
          sx={{
            cursor: 'pointer',
            paddingTop: '5px',
            width: '1.25em',
            height: '1.25em',
          }}
        />
        {viewIcons && (
          <IconButton
            onClick={(event) =>
              handleActionClick(event, {
                operation: 'appendRiskIndicatorToCategory',
                targetId: modelId,
                categoryListIndex: categoryIndex,
              })
            }
            sx={{ padding: 0 }}
          >
            <AddCircleOutline />
          </IconButton>
        )}
        {viewIcons && (
          <IconButton
            onClick={(event) =>
              handleActionClick(event, {
                operation: 'removeRiskIndicatorAtIndex',
                targetId: modelId,
                categoryListIndex: categoryIndex,
                riskIndicatorListIndex: index,
              })
            }
            sx={{ padding: 0 }}
          >
            <Image
              src="images/icons/delete.svg"
              loader={appImageLoader}
              width={20}
              height={20}
              alt="delete"
            />
          </IconButton>
        )}
      </UIFlexWrapBox>
      <UIFlexWrapBox
        sx={{
          marginLeft: '120px',
        }}
      >
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          {canDisplayComponent &&
            componentFn(
              indicator,
              dataSources,
              riskFields,
              riskValues,
              lists,
              noop,
              noop,
              noop,
              noop,
              true
            )}
        </Collapse>
      </UIFlexWrapBox>
    </Box>
  );
};

export default BuildModelRiskIndicator;
