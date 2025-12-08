import { useState } from "react";
import { useSearchUser } from "@/features/admin/test/hooks/useTest";

const Search = () => {
  const [text, setText] = useState("");
  const { data, isLoading } = useSearchUser(text);

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search user..."
      />

      {isLoading && <p>Searching...</p>}

      <ul>
        {data?.map((u: any) => (
          <li key={u._id}>{u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
