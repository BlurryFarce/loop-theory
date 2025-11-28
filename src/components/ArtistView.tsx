import { ArtistResponse } from "@/types/idea";

export default function ArtistView({ data }: { data: ArtistResponse }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-slate-400">Mood and atmosphere</p>
      <p>{data.summary}</p>

      {data.imagery && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Key imagery</p>
          <p>{data.imagery}</p>
        </>
      )}

      {data.references?.length > 0 && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">
            Visual references
          </p>
          <ul className="list-disc list-inside space-y-1">
            {data.references.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}

      {data.palette && (
        <>
          <p className="text-xs uppercase text-slate-400 mt-2">Palette</p>
          <p>{data.palette}</p>
        </>
      )}
    </div>
  );
}
