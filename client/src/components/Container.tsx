import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <div className="w-full md:w-3/4 lg:w-3/4 flex flex-col gap-8 p-4  m-auto ">
      {children}
    </div>
  );
}

export default Container;
