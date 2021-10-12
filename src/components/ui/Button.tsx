import React from "react";

interface Props {
  text: string;
  onClick: any;
  className?: string;
}

const Button: React.FC<Props> = ({ text, onClick, className }) => {
  return (
    <button
      className={
        "bg-primary hover:bg-hover p-3 text-white font-bold cursor-pointer rounded-md text-base" +
        className
      }
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
