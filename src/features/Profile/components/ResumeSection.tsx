interface Props {
  resume?: string;
}

export default function ResumeSection({ resume }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-2">Resume</h2>

      {resume ? (
        <p className="text-green-600">Resume Uploaded</p>
      ) : (
        <p className="text-gray-500">No resume uploaded</p>
      )}
    </div>
  );
}
