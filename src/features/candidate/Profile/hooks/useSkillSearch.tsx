import { useQuery } from "@tanstack/react-query";
import { searchSkill } from "@/api/skills/searchSkill";

export function useSearchSkills(query: string) {
            return useQuery({
                        queryKey: ["search-skills", query],
                        queryFn: async () => {
                                    if (!query) return [];
                                    const data = await searchSkill(query);
                                    return data ?? [];
                        },
                        enabled: !!query
            });
}
