import { EngineerResponse } from "@/types/idea";

export default function EngineerView({ data }: { data: EngineerResponse }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-slate-400">Technical overview</p>
      <p>{data.summary}</p>

      {data.systems?.length > 0 && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Core systems</p>
          <ul className="list-disc list-inside space-y-1">
            {data.systems.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}

      {data.challenges && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Challenges</p>
          <p>{data.challenges}</p>
        </>
      )}
    </div>
  );
}
