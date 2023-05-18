/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React from 'react';
import Status from './Status';
import Unmasking from './Unmasking';
import Usage from './Usage';

const GovernancesTab = ({
  url,
  accessToken,
}: {
  url: string;
  accessToken: string;
}): JSX.Element => {
  return (
    <>
      {url === 'unmask' && <Unmasking accessToken={accessToken} />}
      {url === 'usage' && <Usage />}
      {url === 'status' && <Status />}
    </>
  );
};

export default GovernancesTab;
