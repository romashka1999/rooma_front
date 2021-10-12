import React from "react";

interface Props {
  placeHolder?: string;
  inputRef: React.LegacyRef<HTMLInputElement> | undefined;
}

const Input: React.FC<Props> = ({ placeHolder, inputRef }) => {
  return (
    <input
      className="p-3 bg-customGray text-base text-white rounded-md"
      ref={inputRef}
      placeholder={placeHolder}
    />
  );
};

export default Input;
