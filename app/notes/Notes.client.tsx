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
import styles from "./Notes.module.css";

const PER_PAGE = 9;

export function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const notesQuery = useNotes(page, PER_PAGE, debouncedSearch);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
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
            onClick={() => setModalOpen(true)}
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
        {notesQuery.isLoading && <NoteList notes={[]} loading />}
        {notesQuery.data && <NoteList notes={notesQuery.data.notes} />}
        {notesQuery.data && notesQuery.data.totalPages > 1 && (
          <Pagination
            page={notesQuery.data.page}
            totalPages={notesQuery.data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal open={modalOpen} title="Create note" onClose={closeModal}>
        <NoteForm onCancel={closeModal} />
      </Modal>
      <Toaster position="top-right" />
    </main>
  );
}
