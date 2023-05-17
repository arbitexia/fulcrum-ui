/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { ImageLoaderProps } from 'next/image';
import config from '@/config';

export const appImageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string =>
  `${config.APP.HOSTING_URL}/${src}?w=${width}&q=${quality || 75}`;

export const s3ImageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string => `${src}?w=${width}&q=${quality || 75}`;
