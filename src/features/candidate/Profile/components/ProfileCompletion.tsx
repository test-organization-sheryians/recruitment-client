
type props={
  completion:number
}
function ProfileCompletion({completion}:props) {
  

  return <div>
    <div className="mb-4">
      <p className="text-sm font-medium">
        Profile Completion: {completion}%
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
        <div
          className={`h-3 rounded-full transition-all ${
            completion < 60 ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${completion}%` }}
        />
      </div>

      {completion < 60 && (
        <p className="text-xs text-red-500 mt-1">
          Complete the profile for more oppurtunities.
        </p>
      )}
    </div>
  </div>;
}

export default ProfileCompletion;
