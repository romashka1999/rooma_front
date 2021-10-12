import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Main = () => {
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const loginHandler = () => {
    if (inputRef.current === null) return;
    const roomId = inputRef.current.value;
    console.log(`roomId`, roomId);
    history.push(`rooms/${roomId}`);
  };

  return (
    <div className="w-2/3 flex justify-center gap-2">
      <Input placeHolder={"roomId"} inputRef={inputRef} />
      <Button text="login" onClick={loginHandler} />
    </div>
  );
};

export default Main;
