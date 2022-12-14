import { useCallback, useId, type FC, type ChangeEvent } from "react";
import { CheckBox, FormGroup } from "smarthr-ui";
import { useFormContext } from "react-hook-form";

interface Props {
  variable: string;
}

export const VariableToggle: FC<Props> = ({ variable }) => {
  const id = useId();
  const { setValue } = useFormContext();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked;
      setValue(variable, checked);
    },
    [setValue, variable]
  );

  return (
    <FormGroup
      title={variable}
      titleType="subBlockTitle"
      innerMargin="XXS"
      htmlFor={id}
    >
      <CheckBox id={id} onChange={handleChange}>
        有効にする
      </CheckBox>
    </FormGroup>
  );
};
