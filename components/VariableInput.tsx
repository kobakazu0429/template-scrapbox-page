import { useId, type FC } from "react";
import { Input, FormGroup } from "smarthr-ui";
import { useFormContext } from "react-hook-form";

interface Props {
  variable: string;
}

export const VariableInput: FC<Props> = ({ variable }) => {
  const id = useId();
  const { register } = useFormContext();

  return (
    <FormGroup
      title={variable}
      titleType="subBlockTitle"
      innerMargin="XXS"
      htmlFor={id}
    >
      <Input id={id} width="100%" {...register(variable)} />
    </FormGroup>
  );
};
