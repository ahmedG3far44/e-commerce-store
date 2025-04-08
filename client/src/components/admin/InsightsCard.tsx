import React from "react";

function InsightsCard({
  name,
  icon,
  money,
  info,
  prefix,
}: {
  name: string;
  icon: React.ReactNode;
  money: number;
  info?: string;
  prefix?: string;
}) {
  return (
    <div
      className={
        "min-w-[350px] p-4 border border-zinc-50 rounded-md flex flex-col justify-center items-start gap-2 bg-white"
      }
    >
      <div className="w-full flex justify-between items-center">
        <h1 className=" text-2xl ">{name}</h1> <span>{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black text-zinc-900">
          {money.toLocaleString() === "0" ? "NA" : money.toLocaleString()}
        </span>
        <span className="text-sm font-mono text-zinc-500">{prefix}</span>
      </div>
      <p className="text-sm  font-medium text-zinc-500">{info}</p>
    </div>
  );
}

export default InsightsCard;
