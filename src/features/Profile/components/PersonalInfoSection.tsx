type Props = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function PersonalInfoSection({
  firstName,
  lastName,
  email,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Personal Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">First Name</label>
          <p className="font-medium">{firstName}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Last Name</label>
          <p className="font-medium">{lastName}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-medium">{email}</p>
        </div>
      </div>
    </div>
  );
}
