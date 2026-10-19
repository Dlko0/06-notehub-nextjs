import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import { NotesClient } from "./Notes.client";

const PER_PAGE = 9;

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, PER_PAGE, ""],
    queryFn: () => getNotes(1, PER_PAGE, ""),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
