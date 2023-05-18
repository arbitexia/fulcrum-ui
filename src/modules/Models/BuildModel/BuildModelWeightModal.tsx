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
  const [error, setError] = useState<string | null>(null);

  const getSum = (lockedOnly = false, multiplier = 1000): number => {
    const lockedWeights = weightsIndex.map((item, index) => {
      if (lockedIndex[index]) {
        return weightsIndex[index] * multiplier;
      }
      return 0;
    });
    const allWeightsSum = sum(weightsIndex) * multiplier;
    return lockedOnly ? sum(lockedWeights) : allWeightsSum;
  };

  const equalizeOnInit = (inputWeights: number[]): number[] => {
    setError(null);
    const currentSum = sum(
      inputWeights.map((inputWeight) => inputWeight * 1000)
    );
    if (currentSum !== 1000) {
      const weightLength = inputWeights.length;
      const each = -Math.floor((currentSum - 1000) / weightLength);
      const remainderOriginal = -((currentSum - 1000) % weightLength);
      let remainder = remainderOriginal;

      const newWeightsValue = inputWeights.map((weight) => {
        const applyRemainder = remainder;
        if (remainder !== 0) {
          remainder = 0;
          // after the first time we apply the remainder, we want to 0 it out so it doesn't apply anywhere else.
        }
        return weight * 1000 + applyRemainder + each;
      });

      const adjustedSum = sum(newWeightsValue);
      if (adjustedSum != 1000) {
        console.log(`Problem here (init): ${adjustedSum}`);
      }
      return newWeightsValue.map((val) => val / 1000);
    }
    return inputWeights;
  };

  const equalize = (): number[] => {
    setError(null);
    const unlockedList = lockedIndex && lockedIndex.filter((index) => !index);
    const lockedWeightsSum = getSum(true);
    const weights = weightsIndex.map((weight) => weight * 1000);
    const unlockedWeightsSum = 1000 - lockedWeightsSum;
    if (unlockedList.length === 0) {
      return weightsIndex;
    }
    const unlockedListLength = unlockedList.length;
    const each = Math.floor(unlockedWeightsSum / unlockedListLength);
    const originalRemainder = unlockedWeightsSum % unlockedListLength;
    let remainder = originalRemainder;

    return weights.map((weight, index) => {
      if (!lockedIndex[index] && remainder !== 0) {
        const remainderSum = remainder + each;
        remainder = 0;
        return remainderSum / 1000;
      } else if (!lockedIndex[index]) {
        return each / 1000;
      } else {
        return weight / 1000;
      }
    });
  };

  const adjustWeights = (
    value: number,
    index: number,
    inputArray: number[]
  ): number[] => {
    setError(null);
    if (inputArray.length === 1) {
      const newWeightArray = [...inputArray];
      newWeightArray[0] = 1;
      return newWeightArray;
    }
    const newSum = (sum(inputArray) - inputArray[index] + value) * 1000;
    const numberOfWeightsLocked = lockedIndex.filter(
      (locked) => !!locked
    ).length;
    const unlockedWeightsNumber = inputArray.length - 1 - numberOfWeightsLocked;
    const each = -Math.floor((newSum - 1000) / unlockedWeightsNumber);
    const originalRemainder = -((newSum - 1000) % unlockedWeightsNumber);
    let remainder = originalRemainder;
    let payback = unlockedWeightsNumber === 0 ? -(newSum - 1000) : 0;

    const candidateArray: number[] = inputArray.map(
      (weight, currentWeightIndex) => {
        if (lockedIndex[currentWeightIndex]) {
          return weight * 1000;
        }
        const candidateSum: number = weight * 1000 + remainder + each;
        if (currentWeightIndex === index) {
          return value * 1000;
        }
        if (remainder !== 0) {
          remainder = 0;
          if (candidateSum < 0) {
            payback += candidateSum;
            return 0;
          }
        } else {
          if (candidateSum < 0) {
            payback += candidateSum;
            return 0;
          }
        }
        return candidateSum;
      }
    );

    if (payback !== 0) {
      candidateArray[index] = value * 1000 + payback;
    }
    const adjustedSum = sum(candidateArray);
    if (adjustedSum !== 1000) {
      console.log(`Problem here: ${adjustedSum}`);
    }
    return candidateArray.map((val) => val / 1000);
  };

  const onEqualize = (): void => {
    setWeightsIndex(equalize());
  };

  const closeDialog: () => void = () => {
    setLockedIndex([]);
    setWeightsIndex([]);
    onClose();
    return;
  };

  const onSave: () => void = () => {
    const weightsSum = getSum(false, 1000);
    const weightsSumOneHundred = Math.floor(weightsSum / 10) * 10;
    if (weightsSumOneHundred !== 1000) {
      setError(
        'Weights do not sum to 100%. Please adjust weights and try again.'
      );
    } else {
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
    }
  };

  useEffect(() => {
    const itemListLength = itemList.length;
    const lockedIndexArray = Array(itemListLength).fill(false);
    const weightsList = itemList.map((item) => item.weight / 1000);
    const equalizedWeightsList = equalizeOnInit(weightsList);
    setLockedIndex(lockedIndexArray);
    setWeightsIndex(equalizedWeightsList);

    return () => {
      setLockedIndex([]);
      setWeightsIndex([]);
    };
  }, [itemList]);

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
                  setWeightsIndex((prevState) =>
                    adjustWeights(value, index, prevState)
                  );
                }}
                incomingWeight={weightsIndex[index]}
                onLock={() => {
                  setLockedIndex((prevState) => {
                    const newArray = [...prevState];
                    newArray[index] = !prevState[index];
                    return newArray;
                  });
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
                  setWeightsIndex((prevState) =>
                    adjustWeights(value, index, prevState)
                  );
                }}
                incomingWeight={weightsIndex[index]}
                onLock={() => {
                  setLockedIndex((prevState) => {
                    const newArray = [...prevState];
                    newArray[index] = !prevState[index];
                    return newArray;
                  });
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
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px', color: 'red' }}>
        {error}
      </UIFlexCenterBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton onClick={onSave}>Update</UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};

export default BuildModelWeightModal;
