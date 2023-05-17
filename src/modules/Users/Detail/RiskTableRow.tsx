/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Collapse,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowRight } from '@mui/icons-material';
import {
  UIScoreChip,
  // UIFlexCenterBox,
  UIFlexWrapBox,
  // UIVerticalArrow,
} from '@/components/UI';
import { StyledChip, StyledPeerChip } from './ui';
import { PeerChartModal } from './PeerChartModal';
import { GraphChartModal } from './GraphChartModal';
import { getRiskTableScoreColor } from '@/libs/color-generator';
import { roundScoreIntelligently } from '@/libs/math-utils';
import { Attribute } from '@/types/scoring.type';

interface RiskTableRowProps {
  row: Attribute;
  selectedRow: number;
  index: number;
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
  onScrollToBasis: (attributeId: string) => void;
}

export const RiskTableRow = ({
  row,
  index,
  selectedRow,
  setSelectedRow,
  onScrollToBasis,
}: RiskTableRowProps): JSX.Element => {
  const [openPeerChart, setOpenPeerChart] = useState<boolean>(false);
  const [openGraphChart, setOpenGraphChart] = useState<boolean>(false);
  const [selectedAtribute, setSelectedAttribute] = useState<string>('');

  return (
    <>
      <TableRow>
        <TableCell sx={{ height: '48px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              selectedRow == -1 || selectedRow != index
                ? setSelectedRow(index)
                : setSelectedRow(-1);
            }}
          >
            {selectedRow == index ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowRight />
            )}
          </IconButton>
          {row.name}
        </TableCell>
        <TableCell sx={{ height: '48px' }}>
          {roundScoreIntelligently(row.score ?? 0)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} padding="none">
          <Collapse in={selectedRow == index} timeout="auto" unmountOnExit>
            {row &&
              row.attributes &&
              row.attributes.map((item: Attribute, attributeIndex) => {
                return (
                  <Table key={attributeIndex} size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ paddingLeft: '50px' }}>
                          <Box>{item.name}</Box>
                          <UIFlexWrapBox mt={1}>
                            <StyledChip
                              onClick={() => onScrollToBasis('1')}
                              icon={
                                <Image
                                  src="images/icons/profile-basis.svg"
                                  loader={appImageLoader}
                                  width={15}
                                  height={16}
                                  alt="basis"
                                />
                              }
                              label="Basis"
                            />
                            <StyledChip
                              onClick={() => {
                                setSelectedAttribute(item.name);
                                setOpenGraphChart(true);
                              }}
                              icon={
                                <Image
                                  src="images/icons/profile-graph.svg"
                                  loader={appImageLoader}
                                  width={16}
                                  height={16}
                                  alt="graph"
                                />
                              }
                              label="Graph"
                            />
                            <StyledPeerChip
                              onClick={() => {
                                setSelectedAttribute(item.name);
                                setOpenPeerChart(true);
                              }}
                              bgColor={getRiskTableScoreColor(
                                roundScoreIntelligently(item?.score ?? 0)
                              )}
                            />
                          </UIFlexWrapBox>
                        </TableCell>
                        <TableCell sx={{ width: '200px' }}>
                          <UIScoreChip
                            label={roundScoreIntelligently(item.score ?? 0)}
                            bgColor={getRiskTableScoreColor(
                              roundScoreIntelligently(item?.score ?? 0)
                            )}
                            sx={{ marginRight: '10px' }}
                          />
                        </TableCell>
                        {/*<TableCell sx={{ width: '120px' }}>*/}
                        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
                        {/*    <Box width="12px">*/}
                        {/*      {item.up != 2 ? (*/}
                        {/*        <UIVerticalArrow*/}
                        {/*          direction={item.up}*/}
                        {/*          color={getColorPair(index).textColor}*/}
                        {/*        />*/}
                        {/*      ) : (*/}
                        {/*        ''*/}
                        {/*      )}*/}
                        {/*    </Box>*/}
                        {/*    <UIFlexCenterBox*/}
                        {/*      sx={{*/}
                        {/*        width: '32px',*/}
                        {/*        height: '32px',*/}
                        {/*        color: getColorPair(index).textColor,*/}
                        {/*        background: getColorPair(index).bgColor,*/}
                        {/*      }}*/}
                        {/*    >*/}
                        {/*      {item.trend}*/}
                        {/*    </UIFlexCenterBox>*/}
                        {/*  </UIFlexWrapBox>*/}
                        {/*</TableCell>*/}
                      </TableRow>
                    </TableBody>
                  </Table>
                );
              })}
          </Collapse>
        </TableCell>
      </TableRow>
      <PeerChartModal
        open={openPeerChart}
        attribute={selectedAtribute}
        onClose={() => setOpenPeerChart(false)}
      />
      <GraphChartModal
        open={openGraphChart}
        attribute={selectedAtribute}
        onClose={() => setOpenGraphChart(false)}
      />
    </>
  );
};
