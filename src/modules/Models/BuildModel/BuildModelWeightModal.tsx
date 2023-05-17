/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import {
  UIDefaultDialog,
  UIFlexCenterBox,
  UIModalButton,
} from '@/components/UI';
import { Box } from '@mui/material';
import { AttributesType, DefaultModalProps, RiskIndicatorType } from '@/types';
import BuildModelWeightChange from './BuildModelWeightChange';
import { RiskIndicatorModelType } from '@/types/models.type';
import { sum } from 'lodash';

export interface WeightModalProps extends DefaultModalProps {
  modelId: string;
  itemList: AttributesType[] | RiskIndicatorModelType[];
  riskIndicatorsById: { [id: string]: RiskIndicatorType };
  itemType: string;
  categoryIndex: number;
  onWeightChange: ({
    weightChangeModelId,
    weightChangeCategoryIndex,
    riskIndicatorIndex,
    value,
  }: {
    weightChangeModelId: string;
    weightChangeCategoryIndex: number;
    riskIndicatorIndex?: number;
    value: number;
  }) => void;
}

const BuildModelWeightModal = ({
  open,
  onClose,
  modelId,
  itemList,
  riskIndicatorsById,
  itemType,
  categoryIndex,
  onWeightChange,
}: WeightModalProps): JSX.Element => {
  const [lockedIndex, setLockedIndex] = useState<boolean[]>([]);
  const [weightsIndex, setWeightsIndex] = useState<number[]>([]);

  useEffect(() => {
    const itemListLength = itemList.length;
    const lockedIndexArray = Array(itemListLength).fill(false);
    setLockedIndex(lockedIndexArray);
    const weightsList = itemList.map((item) => item.weight);
    setWeightsIndex(weightsList);
    return () => {
      setLockedIndex([]);
      setWeightsIndex([]);
    };
  }, [itemList]);

  const onEqualize = (): void => {
    const unlockedList = lockedIndex && lockedIndex.filter((index) => !index);
    const lockedWeights = weightsIndex.map((item, index) => {
      if (lockedIndex[index]) {
        return weightsIndex[index];
      }
      return 0;
    });
    const totalAvailableForEqualize = 1.0 - sum(lockedWeights);
    const unlockedListLength = unlockedList.length;
    const equalizedWeights: number =
      unlockedListLength > 0
        ? totalAvailableForEqualize / unlockedListLength
        : 0;
    const newWeightsList = weightsIndex.map((weight, index) => {
      if (!lockedIndex[index]) {
        return equalizedWeights;
      } else {
        return weight;
      }
    });
    setWeightsIndex(newWeightsList);
  };

  const closeDialog: () => void = () => {
    setLockedIndex([]);
    setWeightsIndex([]);
    onClose();
    return;
  };

  const onSave: () => void = () => {
    if (itemType === 'riskIndicator') {
      weightsIndex.forEach((weight, index) => {
        onWeightChange({
          weightChangeModelId: modelId,
          weightChangeCategoryIndex: categoryIndex,
          riskIndicatorIndex: index,
          value: weight,
        });
      });
    } else if (itemType === 'category') {
      weightsIndex.forEach((weight, index) => {
        onWeightChange({
          weightChangeModelId: modelId,
          weightChangeCategoryIndex: index,
          value: weight,
        });
      });
    }
    closeDialog();
  };
  return (
    <UIDefaultDialog
      open={open}
      onClose={closeDialog}
      title="Select Weights"
      modalWidth="auto"
    >
      <Box>
        {itemList?.map((item, index) => {
          if (itemType === 'riskIndicator') {
            const riskIndicatorModel: RiskIndicatorModelType =
              item as RiskIndicatorModelType;
            const itemId =
              (riskIndicatorModel && riskIndicatorModel?.attributeId) ?? null;
            const riskIndicator =
              riskIndicatorsById && itemId in riskIndicatorsById
                ? riskIndicatorsById[itemId]
                : null;
            const riskIndicatorName =
              (riskIndicator && riskIndicator?.name) ?? '';
            return (
              <BuildModelWeightChange
                key={index}
                onChangeWeight={(value) => {
                  setWeightsIndex((prevState) => {
                    const newWeightsArray = [...prevState];
                    newWeightsArray[index] = value;
                    return newWeightsArray;
                  });
                }}
                incomingWeight={weightsIndex[index]}
                onLock={() => {
                  const lockedWeights = weightsIndex.map(
                    (lockedWeight, lockIndex) => {
                      if (lockedIndex[lockIndex]) {
                        return weightsIndex[lockIndex];
                      }
                      return 0;
                    }
                  );
                  if (sum(lockedWeights) <= 1) {
                    setLockedIndex((prevState) => {
                      const newArray = [...prevState];
                      newArray[index] = !prevState[index];
                      return newArray;
                    });
                  }
                }}
                itemName={riskIndicatorName}
              />
            );
          } else if (itemType === 'category') {
            const category: AttributesType = item as AttributesType;
            const categoryName = (category && category?.name) ?? '';
            return (
              <BuildModelWeightChange
                key={index}
                onChangeWeight={(value) => {
                  setWeightsIndex((prevState) => {
                    const newWeightsArray = [...prevState];
                    newWeightsArray[index] = value;
                    return newWeightsArray;
                  });
                }}
                incomingWeight={weightsIndex[index]}
                onLock={() => {
                  const lockedWeights = weightsIndex.map(
                    (lockedWeight, lockIndex) => {
                      if (lockedIndex[lockIndex]) {
                        return weightsIndex[lockIndex];
                      }
                      return 0;
                    }
                  );
                  if (sum(lockedWeights) <= 1) {
                    setLockedIndex((prevState) => {
                      const newArray = [...prevState];
                      newArray[index] = !prevState[index];
                      return newArray;
                    });
                  }
                }}
                itemName={categoryName}
              />
            );
          }
        })}
      </Box>
      <UIFlexCenterBox
        sx={{
          fontWeight: '400',
          fontSize: '14px',
          lineHeight: '20px',
          textAlign: 'center',
          color: '#485A63',
          mt: '30px',
          cursor: 'pointer',
        }}
        onClick={onEqualize}
      >
        <Image
          src="images/icons/equalize.svg"
          loader={appImageLoader}
          width={20}
          height={20}
          alt="lock"
        />
        Equalize
      </UIFlexCenterBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton onClick={onSave}>Update</UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};

export default BuildModelWeightModal;
