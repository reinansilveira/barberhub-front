import { useRouter, useSearchParams } from "next/navigation";

export function useDateSearchParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (date: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("date", date);
    router.replace(`?${params.toString()}`, { scroll: false });
  };
}
