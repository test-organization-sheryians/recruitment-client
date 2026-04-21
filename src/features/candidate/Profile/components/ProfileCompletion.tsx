type Props = {
  completion: number;
};

function ProfileCompletion({ completion }: Props) {
  const getColor =
    completion < 40
      ? "bg-red-500"
      : completion < 70
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="w-full">
      <div className="mb-4">

        {/* Label */}
        <div className="flex items-center justify-between">
          <p className="text-sm sm:text-base font-medium text-gray-800">
            Profile Completion
          </p>
          <span className="text-xs sm:text-sm font-semibold text-gray-600">
            {completion}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-in-out ${getColor}`}
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Warning */}
        {completion < 60 && (
          <p className="text-xs sm:text-sm text-red-500 mt-2">
            Complete your profile to unlock more opportunities.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileCompletion;