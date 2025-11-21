interface Props {
  profile: any;
}

export default function PersonalInfoSection({ profile }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-2">Personal Information</h2>
      <p>{profile?.firstName} {profile?.lastName}</p>
      <p>{profile?.email}</p>
      <p>{profile?.phone}</p>
    </div>
  );
}
