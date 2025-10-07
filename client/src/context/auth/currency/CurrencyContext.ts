import { createContext, useContext } from "react";


interface CurrencyContextType{
    activeCurrency: "USD" | "EUR"  | "EGP" | "AED" | "SDG" | "GBP";
    from:"USD";
    to:"EGP";
    value:number;

}
export const CurrencyContext = createContext<CurrencyContextType>({
    activeCurrency:"USD",
    from:"USD", 
    to:"EGP",
    value:1
}) 


export const useCurrency = useContext(CurrencyContext);