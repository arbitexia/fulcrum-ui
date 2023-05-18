/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import { UIDefaultTextField, UITextArea } from '@/components/UI/TextField';
import { removeLast } from '@/libs/string-utils';
import React, { SyntheticEvent } from 'react';

const UIAutocomplete = ({
  matchItemValues,
  textValue,
  lists,
  setValuesLists,
  handleChange,
  setTextValue,
  separators,
  listPrefix,
  onDoubleClick,
  textArea = false,
  readOnly = false,
}: {
  matchItemValues: string[];
  textValue: string;
  lists: { id: string; label: string }[];
  setValuesLists: (input: string[]) => void;
  handleChange: (newVal: string[]) => void;
  setTextValue: (input: string) => void;
  separators: string[];
  listPrefix: string;
  onDoubleClick: () => void;
  textArea?: boolean;
  readOnly?: boolean;
}): JSX.Element => {
  const matchCanHaveTexts = textValue && textValue.length >= 1;
  const matchTextHasList = matchCanHaveTexts
    ? textValue[textValue.length - 1] === listPrefix
    : false;

  const textFieldValueFn = (
    params: AutocompleteRenderInputParams
  ): JSX.Element => {
    return (
      <UIDefaultTextField
        {...params}
        sx={{ height: '36px', paddingLeft: '2px', width: '20em' }}
        variant="standard"
        placeholder="Add value or @list"
      />
    );
  };

  const textAreaValueFn = (
    params: AutocompleteRenderInputParams
  ): JSX.Element => {
    return (
      <UITextArea
        {...params}
        sx={{ height: '300px', paddingLeft: '2px', width: '38em' }}
        multiline
        placeholder="Add value or @list"
        rows={10}
        onKeyDown={(event) => {
          if (event.code === 'Enter') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            event.target.value = `${event.target.value}\n`;
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      />
    );
  };
  const renderInputFn = textArea ? textAreaValueFn : textFieldValueFn;

  const height = textArea ? 'auto' : '36px';
  const width = textArea ? 'auto' : '20em';

  const matchItemValuesSet = new Set(matchItemValues);

  return (
    <Autocomplete
      sx={{ height, width }}
      value={matchItemValues ?? []}
      inputValue={textValue}
      options={lists}
      multiple
      disableClearable
      onDoubleClick={onDoubleClick}
      renderTags={() => null}
      renderInput={renderInputFn}
      filterOptions={(options: { id: string; label: string }[]) => {
        if (matchTextHasList) {
          return options.filter((option) => !matchItemValuesSet.has(option.id));
        }
        return [];
      }}
      renderOption={(props, option) => {
        const optionId = typeof option === 'string' ? option : option.id;
        const optionLabel = typeof option === 'string' ? option : option.label;
        return (
          <li {...props} id={optionId}>
            {optionLabel}
          </li>
        );
      }}
      onInputChange={(event: SyntheticEvent, value: string) => {
        const realValue =
          event.type === 'click'
            ? `${removeLast(textValue, listPrefix)}${event.currentTarget.id}`
            : value;
        const options: string[] = [];
        const tempOptions: string[] = [];
        separators.forEach((separator, separatorIndex) => {
          if (tempOptions.length > 0) {
            const newSplit: string[] = [];
            tempOptions.forEach((splitVal) =>
              splitVal.split(separator).map((val) => newSplit.push(val))
            );
            if (separatorIndex === separators.length - 1) {
              newSplit.forEach((option) => options.push(option));
            } else {
              tempOptions.splice(0, tempOptions.length); // clear the temp list, repopulate.
              newSplit.forEach((option) => tempOptions.push(option));
            }
          } else {
            const split = realValue.split(separator);
            split.forEach((splitVal) => tempOptions.push(splitVal));
            if (separatorIndex === separators.length - 1) {
              tempOptions.forEach((option) => options.push(option));
            }
          }
        });

        const split = options.map((val) => val.trim()).filter((val) => !!val);
        setValuesLists(split);
        handleChange(split as string[]);
        setTextValue(realValue);
      }}
      freeSolo
      disabled={readOnly}
    />
  );
};

export default UIAutocomplete;
