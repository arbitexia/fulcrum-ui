/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { UIFlexWrapBox } from '@/components/UI';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';

const BuildInformationIcon = ({
  title,
  onOpenHistory,
  readOnly,
}: {
  title: string;
  onOpenHistory: () => void;
  readOnly: boolean;
}): JSX.Element => {
  return (
    <Tooltip title={title} placement="top" style={{ cursor: 'pointer' }}>
      <UIFlexWrapBox>
        <IconButton
          sx={{ padding: 0 }}
          onClick={onOpenHistory}
          disabled={readOnly}
        >
          <Image
            src="images/icons/info.svg"
            loader={appImageLoader}
            width={16}
            height={16}
            alt="info"
          />
        </IconButton>
      </UIFlexWrapBox>
    </Tooltip>
  );
};

export default BuildInformationIcon;
