"use client";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { ClassValue } from "clsx";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { AddIcon, SearchIcon, SubtractIcon } from "./icons";
import { Minus, Plus } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelColor?: string;
  errorMessages?: string;
}

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelColor?: string;
}

export interface NumberInputProps extends InputProps {
  onDecrease?: () => void;
  onIncrease?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, label, labelColor, errorMessages, ...props }, ref) => {
    return (
      <div className="relative w-full flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "font-semibold cursor-pointer mb-2",
            labelColor ? labelColor : "text-primaryWord",
            label ? "" : "hidden"
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={cn(
            "border-0 outline outline-1 outline-borderColor rounded py-1 px-3 focus:outline-primary disabled:outline-disableColor font-normal text-primaryWord",
            errorMessages ? "outline-red-500" : "",
            className
          )}
          {...props}
        />
        <span className="absolute -bottom-5 text-red-500 text-xs">
          {errorMessages ? errorMessages : ""}
        </span>
      </div>
    );
  }
);
Input.displayName = "Input";

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, type, name, id, placeholder, label, labelColor, ...props },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "font-semibold cursor-pointer mb-2",
            labelColor ? labelColor : "text-primaryWord",
            label ? "" : "hidden"
          )}
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          name={name}
          placeholder={placeholder}
          className={cn(
            "border-0 outline outline-1 outline-borderColor rounded py-1 px-3 focus:outline-primary disabled:outline-disableColor font-normal text-primaryWord",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export const SearchInput = ({
  id,
  type = "text",
  popoverPosition = "bottom",
  popoverContent,
  placeholder,
  className,
}: {
  id?: string;
  type?: string;
  popoverPosition?: "bottom-start" | "bottom-end" | "bottom";
  popoverContent?: ReactNode;
  placeholder?: string;
  className?: ClassValue;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover
      isOpen={showPopover}
      onOpenChange={setShowPopover}
      placement={popoverPosition}
      showArrow={true}
    >
      <PopoverTrigger>
        <div className={cn("relative flex flex-row items-center")}>
          <label
            htmlFor={id}
            className="absolute start-2 cursor-pointer font-normal"
          >
            <SearchIcon />
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={cn(
              "border-0 outline outline-1 outline-black rounded py-1 px-10 focus:outline-4 focus:outline-primary",
              className
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white shadow-primaryShadow">
        <div
          className="max-h-[250px] overflow-y-scroll"
          onClick={() => setShowPopover(!showPopover)}
        >
          {popoverContent}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      type,
      name,
      id,
      placeholder,
      label,
      labelColor,
      errorMessages,
      value,
      onChange,
      onDecrease,
      onIncrease,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className="w-full flex flex-row items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={cn(
            "cursor-pointer text-primary hover:text-secondary",
            disabled ? "opacity-0" : ""
          )}
          onClick={onDecrease}
        >
          <Minus />
        </span>
        <input
          ref={ref}
          id={id}
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-[60px] border-0 outline outline-1 outline-borderColor rounded py-1 px-3 focus:outline-primary disabled:outline-disableColor font-normal text-center text-primaryWord",
            errorMessages ? "outline-red-500" : "",
            className
          )}
          {...props}
        />
        <span
          className={cn(
            "cursor-pointer text-primary hover:text-secondary",
            disabled ? "opacity-0" : ""
          )}
          onClick={onIncrease}
        >
          <Plus />
        </span>
      </div>
    );
  }
);
NumberInput.displayName = "Input";
