import { DesignerResponse } from "@/types/idea";

export default function DesignerView({ data }: { data: DesignerResponse }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-slate-400">Core fantasy</p>
      <p>{data.coreFantasy}</p>

      <p className="text-xs uppercase text-slate-400 mt-2">Core loop</p>
      <p>{data.coreLoop}</p>

      {data.mechanics?.length > 0 && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Key mechanics</p>
          <ul className="list-disc list-inside space-y-1">
            {data.mechanics.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
