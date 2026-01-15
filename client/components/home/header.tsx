export default function Header({ heading }: { heading: string }) {
  return (
    <div className="w-full flex items-center justify-between py-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">{heading}</h1>
      </div>
    </div>
  );
}
