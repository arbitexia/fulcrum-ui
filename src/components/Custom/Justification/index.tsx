/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { useState } from 'react';
import {
  UIDefaultDialog,
  UIFlexColumnBox,
  UIModalButton,
  UITextArea,
} from '@/components/UI';
import { justificationList } from '@/_mock';
import { DefaultModalProps } from '@/types';
import {
  StyledJustificationBox,
  StyledJustificationList,
  StyledListItemButton,
} from './ui';

interface JustificationModalProps extends DefaultModalProps {
  submitFn: (selectedItems: string[], justificationText: string) => void;
}

const CustomJustification = ({
  submitFn,
  open,
  onClose,
}: JustificationModalProps): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set([]));
  const [justificationText, setJustificationText] = useState<string>('');

  const addItemToSelectedList = (index: number): void => {
    setSelectedItems((prevValue) => {
      const newSet = new Set(prevValue);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const closeFn = (): void => {
    setSelectedItems(new Set([]));
    setJustificationText('');
    onClose();
  };

  const submit = (): void => {
    const selectedItemsArray = Array.from(selectedItems).sort();
    const names = selectedItemsArray.map(
      (index) => justificationList[index].title
    );
    submitFn(names, justificationText);
    closeFn();
  };

  return (
    <UIDefaultDialog open={open} modalWidth="354px" onClose={closeFn}>
      <UIFlexColumnBox sx={{ alignItems: 'center', gap: 2.5 }}>
        <StyledJustificationBox>
          Justification
          <StyledJustificationList>
            {justificationList.map((item, justificationIndex) => {
              return (
                <StyledListItemButton
                  key={justificationIndex}
                  onClick={() => addItemToSelectedList(justificationIndex)}
                  selected={selectedItems.has(justificationIndex)}
                >
                  {item.title}
                </StyledListItemButton>
              );
            })}
          </StyledJustificationList>
        </StyledJustificationBox>
        <UITextArea
          multiline
          rows={3}
          placeholder="(Optional free text)"
          value={justificationText}
          onChange={(event) => setJustificationText(event.target.value)}
        />
        <UIModalButton onClick={submit}>Send for Approval</UIModalButton>
      </UIFlexColumnBox>
    </UIDefaultDialog>
  );
};

export default CustomJustification;
