import { isContinue } from "@/audio/utils";
import { inputConfig, InputType } from "@/lib/config";

type CellInputProps = {
  type: InputType;
  isWave: boolean;
  ref: React.Ref<HTMLInputElement>;
  value: string;
  setValue: (newValue: string) => void;
  setFocus: () => void;
};

export function CellInput(props: CellInputProps) {
  const { length, handlers } = inputConfig[props.type];

  const handleChange = handlers.getOnChange(props.setValue);
  const handleBlur = handlers.getOnBlur(props.value, props.setValue);
  const handleKeyDown = handlers.getOnKeyDown(props.value, props.setValue);

  return (
    <input
      type="text"
      ref={props.ref}
      maxLength={length}
      placeholder={length === 2 ? "⋅⋅" : "⋅⋅⋅"}
      data-is-continue={isContinue(props.value)}
      className={`${length === 2 ? "w-4" : "w-6"} focus:outline-0 text-xs data-[is-continue=true]:text-muted-foreground`}
      value={props.value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      onFocus={props.setFocus}
      onBlur={handleBlur}
    />
  );
}
