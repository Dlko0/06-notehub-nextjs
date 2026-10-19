"use client";

import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { Modal } from "@/components/Modal/Modal";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import { NoteList } from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { useNotes } from "@/hooks/useNotes";
import type { Note } from "@/types/note";
import styles from "./Notes.module.css";

const PER_PAGE = 9;

export function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const notesQuery = useNotes(page, PER_PAGE, debouncedSearch);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  const openCreate = () => {
    setSelectedNote(undefined);
    setModal("create");
  };

  const openEdit = (note: Note) => {
    setSelectedNote(note);
    setModal("edit");
  };

  const closeModal = useCallback(() => {
    setModal(null);
    setSelectedNote(undefined);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Personal workspace</p>
            <h1>Notes</h1>
          </div>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={openCreate}
          >
            + New note
          </button>
        </header>

        <section className={styles.toolbar} aria-label="Notes tools">
          <SearchBox value={search} onChange={setSearch} />
          <span className={styles.count}>
            {notesQuery.data?.total ?? 0} notes
          </span>
        </section>

        {notesQuery.isError && (
          <p className={styles.error}>
            Unable to load notes. Please try again.
          </p>
        )}
        {notesQuery.isLoading && (
          <NoteList notes={[]} loading onOpen={openEdit} />
        )}
        {notesQuery.data && (
          <NoteList notes={notesQuery.data.notes} onOpen={openEdit} />
        )}
        {notesQuery.data && notesQuery.data.totalPages > 1 && (
          <Pagination
            page={notesQuery.data.page}
            totalPages={notesQuery.data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        open={modal !== null}
        title={modal === "edit" ? "Edit note" : "Create note"}
        onClose={closeModal}
      >
        <NoteForm note={selectedNote} onCancel={closeModal} />
      </Modal>
      <Toaster position="top-right" />
    </main>
  );
}
