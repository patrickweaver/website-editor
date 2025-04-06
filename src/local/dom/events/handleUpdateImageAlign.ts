import { FlexAlignCssValues, AlignOptions } from "../../types";

export function handleUpdateImageAlign(value: AlignOptions) {
  return {
    alignSelf: FlexAlignCssValues[value],
  };
}
