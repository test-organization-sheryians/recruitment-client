interface Props {
  linkedin?: string;
  github?: string;
}

export default function SocialLinksSection({ linkedin, github }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-2">Social Links</h2>

      <div className="space-y-1 text-sm">
        <p>LinkedIn: {linkedin || "Not provided"}</p>
        <p>GitHub: {github || "Not provided"}</p>
      </div>
    </div>
  );
}
