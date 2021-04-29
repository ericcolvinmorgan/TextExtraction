import { Dispatch } from "react";
import { SetStateAction } from "react";

export interface IPanelProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};