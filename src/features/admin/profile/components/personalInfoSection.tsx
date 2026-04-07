type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export default function PersonalInfoSection({
  firstName,
  lastName,
  email,
  phone,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-medium mb-4">
        Personal Information
      </h2>

      {/* ✅ Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="text-sm text-gray-500">
            First Name
          </label>
          <p className="font-medium wrap-break-word">
            {firstName}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-sm text-gray-500">
            Last Name
          </label>
          <p className="font-medium wrap-break-word">
            {lastName}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-sm text-gray-500">
            Email
          </label>
          <p className="font-medium wrap-break-word">
            {email}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-sm text-gray-500">
            Phone
          </label>
          <p className="font-medium wrap-break-word">
            {phone || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
