interface Props {
  availability?: string;
}

export default function AvailabilitySection({ availability }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-2">Availability</h2>

      <p className="text-sm">
        {availability || "Not set"}
      </p>
    </div>
  );
}
