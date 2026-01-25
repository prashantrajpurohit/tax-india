import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Skeleton } from "@/ui/skeleton";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useFormContext } from "react-hook-form";
type CommonProps = {
  name: string;
  label: string;
  placeholder: string;
  isLoading: boolean;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  hidden?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onChangeFun?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
};

type SelectFieldProps = CommonProps & {
  select: true;
  options: (string | Record<string, any>)[];
};

type InputFieldProps = CommonProps & {
  select?: false;
  options?: never;
};
type CustomFieldProps = SelectFieldProps | InputFieldProps;
const CustomField = ({
  name,
  label,
  select,
  options,
  placeholder,
  isLoading,
  hidden,
  type,
  disabled,
  onBlur,
  onClick,
  onChangeFun,
  defaultValue,
}: CustomFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {isLoading ? (
            <Skeleton className="h-4 w-[250px]" />
          ) : (
            !hidden && <FormLabel>{label}</FormLabel>
          )}
          {select ? (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={disabled || isLoading}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(options || []).map((val: any, index: number) => {
                  const value = String(
                    val?._id ?? val?.id ?? val?.value ?? val?.name ?? val,
                  );
                  const label = String(
                    val?.name ?? val?.label ?? val?.value ?? val,
                  );

                  return (
                    <SelectItem
                      className="capitalize"
                      value={value}
                      key={`${name}-${value}-${index}`}
                    >
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ) : (
            <FormControl>
              {isLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <Input
                  {...field}
                  className={`w-full ${hidden ? "hidden" : "block"}`}
                  disabled={disabled || false}
                  placeholder={placeholder}
                  onChange={(e) => {
                    const value =
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value;
                    field.onChange(value);
                    if (onChangeFun) {
                      onChangeFun(e);
                    }
                  }}
                  type={type || "text"}
                  {...(defaultValue ? { defaultValue } : {})}
                  {...(onBlur ? { onBlur } : {})}
                  {...(onClick ? { onClick } : {})}
                />
              )}
            </FormControl>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomField;
