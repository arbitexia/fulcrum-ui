/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, ChangeEvent } from 'react';
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  MoreHoriz,
  AddCircleOutline,
} from '@mui/icons-material';
import { UIDefaultTextField, UIFlexWrapBox } from '@/components/UI';
import { AttributesType, RiskIndicatorType } from '@/types';
import {
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import BuildModelRiskIndicator from './BuildModelRiskIndicator';
import { roundScore } from '@/libs/math-utils';
import { UISelectInterface } from '@/types/common.type';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import {
  getDataSourcesConfigInitialized,
  getDataSourcesFields,
  getDataSourcesSelect,
  modelValueChangeHandler,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { RiskIndicatorModelType } from '@/types/models.type';
import { keyComparator } from '@/libs/sort-utils';

const BuildModelCategory = ({
  modelId,
  modelCategory,
  riskIndicatorsById,
  index,
  setOpenWeightChange,
  categoryRiskIndicators,
}: {
  modelId: string;
  modelCategory?: AttributesType | null;
  riskIndicatorsById?: { [_id: string]: RiskIndicatorType } | null;
  index: number;
  setOpenWeightChange?: (
    categoryIndex: number,
    riskIndicatorIndex?: number
  ) => void;
  categoryRiskIndicators?: RiskIndicatorModelType[];
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);
  const [openCollapse, setOpenCollapse] = useState<boolean>(true);
  const [viewIcons, setViewIcons] = useState<boolean>(false);

  if (!stateResourceData || !stateFieldData || !isDataSourceConfigInitialized) {
    return <LinearProgress />;
  }

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    {
      operation,
      targetId,
      categoryListIndex,
    }: {
      operation: string;
      targetId: string | null;
      categoryListIndex?: number | undefined;
    }
  ): void => {
    if (targetId) {
      dispatch(
        modelValueChangeHandler({ operation, id: targetId, categoryListIndex })
      );
    }
  };

  const toggleViewIcons = (): void => {
    setViewIcons((prevState) => {
      return !prevState;
    });
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    {
      operation,
      targetId,
      categoryListIndex,
    }: {
      operation: string;
      targetId: string | null;
      categoryListIndex?: number | undefined;
    }
  ): void => {
    const value = event.currentTarget.value ?? null;

    if (operation && targetId && value != null) {
      dispatch(
        modelValueChangeHandler({
          operation,
          id: targetId,
          value,
          categoryListIndex,
        })
      );
    }
  };

  const riskIndicatorsList: UISelectInterface[] = [];

  if (riskIndicatorsById) {
    Object.entries(riskIndicatorsById).forEach(
      ([id, riskIndicator]: [id: string, riskIndicator: RiskIndicatorType]) => {
        riskIndicatorsList.push({
          id: id,
          name: riskIndicator.name,
        });
      }
    );
  }

  riskIndicatorsList.sort(
    keyComparator<UISelectInterface>(riskIndicatorsList, 'name')
  );

  return (
    <Box>
      <UIFlexWrapBox
        sx={{
          alignItems: 'center',
          fontWeight: '400',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#504F54',
          py: '10px',
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
        Category
        <UIDefaultTextField
          placeholder="Add name"
          defaultValue={modelCategory?.name}
          sx={{
            width: '288px',
            height: '36px',
            marginLeft: '8px',
            marginRight: '24px',
            paddingLeft: '8px',
            input: {
              '&::placeholder': {
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
              },
            },
          }}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeModelCategoryNameAtIndex',
              targetId: modelId,
              categoryListIndex: index,
            })
          }
          variant="standard"
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
          onClick={() => {
            setOpenWeightChange && setOpenWeightChange(index);
          }}
        >
          {modelCategory?.weight ? roundScore(modelCategory?.weight) : 0}%
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
                operation: 'appendModelCategory',
                targetId: modelId,
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
                operation: 'removeModelCategoryAtIndex',
                targetId: modelId,
                categoryListIndex: index,
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
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        {categoryRiskIndicators &&
          categoryRiskIndicators.length > 0 &&
          categoryRiskIndicators.map(
            (modelRiskIndicator, riskIndicatorIndex) => {
              const { attributeId } = modelRiskIndicator;
              const riskIndicator: RiskIndicatorType | null =
                riskIndicatorsById &&
                attributeId &&
                attributeId in riskIndicatorsById
                  ? riskIndicatorsById[attributeId]
                  : null;

              return (
                <BuildModelRiskIndicator
                  modelId={modelId}
                  categoryIndex={index}
                  index={riskIndicatorIndex}
                  key={riskIndicatorIndex}
                  indicator={riskIndicator}
                  riskIndicatorsList={riskIndicatorsList}
                  modelRiskIndicator={modelRiskIndicator}
                  dataSources={stateResourceData}
                  riskFields={stateFieldData}
                  setOpenWeightChange={() => {
                    setOpenWeightChange &&
                      setOpenWeightChange(index, riskIndicatorIndex);
                  }}
                />
              );
            }
          )}
        {(!categoryRiskIndicators || categoryRiskIndicators.length <= 0) && (
          <BuildModelRiskIndicator
            modelId={modelId}
            categoryIndex={index}
            index={0}
            key={0}
            indicator={null}
            riskIndicatorsList={riskIndicatorsList}
            modelRiskIndicator={null}
            dataSources={stateResourceData}
            riskFields={stateFieldData}
            setOpenWeightChange={() => {
              setOpenWeightChange && setOpenWeightChange(index, 0);
            }}
          />
        )}
      </Collapse>
    </Box>
  );
};

export default BuildModelCategory;
