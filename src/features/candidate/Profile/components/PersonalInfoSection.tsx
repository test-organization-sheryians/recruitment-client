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
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">

      {/* Heading */}
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 sm:mb-5">
        Personal Information
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

        {/* First Name */}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500">First Name</p>
          <p className="font-medium text-sm sm:text-base text-gray-900 break-words">
            {firstName}
          </p>
        </div>

        {/* Last Name */}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500">Last Name</p>
          <p className="font-medium text-sm sm:text-base text-gray-900 break-words">
            {lastName}
          </p>
        </div>

        {/* Email */}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500">Email</p>
          <p className="font-medium text-sm sm:text-base text-gray-900 break-all">
            {email}
          </p>
        </div>

        {/* Phone */}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500">Phone</p>
          <p className="font-medium text-sm sm:text-base text-gray-900 break-words">
            {phone || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}