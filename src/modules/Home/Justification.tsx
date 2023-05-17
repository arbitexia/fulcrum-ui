/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useState } from 'react';
import { List, Collapse, IconButton, Box } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowRight } from '@mui/icons-material';
import {
  UIDefaultDialog,
  UIFlexColumnBox,
  UIFlexSpaceBox,
  UIModalButton,
  UITextArea,
} from '@/components/UI';
import { justificationList } from '@/_mock';
import { StyledListItem } from './ui';

import { DefaultModalProps } from '@/types';

export const HomeJustification = ({
  open,
  onClose,
}: DefaultModalProps): JSX.Element => {
  const [openList, setOpenList] = useState<boolean>(false);
  return (
    <UIDefaultDialog open={open} modalWidth="354px" onClose={onClose}>
      <UIFlexColumnBox sx={{ alignItems: 'center', gap: 2.5 }}>
        <Box
          sx={{
            fontWeight: '400',
            fontSize: '14px',
            lineHeight: '18px',
            color: '#7C909B',
          }}
        >
          Justification
          <List
            sx={{
              width: '250px',
              height: '150px',
              border: '1px solid #CCCCCC',
              borderRadius: '6px',
              marginBottom: '15px',
              overflow: 'auto',
            }}
          >
            {justificationList.map((item, justificationIndex) => {
              return item.items ? (
                <Box key={justificationIndex}>
                  <StyledListItem>
                    <UIFlexSpaceBox sx={{ width: '100%' }}>
                      {item.title}
                      <IconButton
                        aria-label="expand row"
                        sx={{ width: '20px', height: '20px' }}
                        onClick={() => setOpenList(!openList)}
                      >
                        {openList ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </IconButton>
                    </UIFlexSpaceBox>
                  </StyledListItem>
                  <Collapse in={openList} timeout="auto" unmountOnExit>
                    <List sx={{ padding: '0px 10px' }}>
                      {item.items?.map((subItem, itemIndex) => {
                        return (
                          <StyledListItem key={itemIndex}>
                            {subItem.title}
                          </StyledListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              ) : (
                <StyledListItem key={justificationIndex}>
                  {item.title}
                </StyledListItem>
              );
            })}
          </List>
        </Box>
        <UITextArea multiline rows={3} placeholder="(Optional free text)" />
        <UIModalButton>Send for Approval</UIModalButton>
      </UIFlexColumnBox>
    </UIDefaultDialog>
  );
};
