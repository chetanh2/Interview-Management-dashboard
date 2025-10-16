


"use client";

import { useEffect, useState } from "react";
import FeedbackForm from "./FeedbackForm";

type Role = "admin" | "panelist" | "ta_member";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  image?: string;
  company?: { title?: string; department?: string; name?: string };
};

type Todo = { id: number; todo: string; completed: boolean };
type Post = { id: number; title: string; body: string };

export default function ClientTabs({ id, role }: { id: number; role: Role }) {
  const [tab, setTab] = useState<"profile" | "schedule" | "feedback">("profile");

  // 🔒 Only panelists can see & submit feedback
  const canSeeFeedback = role === "panelist";
  const canSubmitFeedback = role === "panelist";

  // Data state
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<{ profile?: boolean; todos?: boolean; posts?: boolean }>({});

  // If someone lands on feedback but isn't panelist, push to profile
  useEffect(() => {
    if (tab === "feedback" && !canSeeFeedback) setTab("profile");
  }, [tab, canSeeFeedback]);

  // Fetch profile
  useEffect(() => {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    (async () => {
      setLoading((l) => ({ ...l, profile: true }));
      try {
        const r = await fetch(`/api/candidates/${id}`, { signal: ctrl?.signal });
        const j = await r.json();
        if (r.ok) setUser(j);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") console.error(e);
      } finally {
        setLoading((l) => ({ ...l, profile: false }));
      }
    })();
    return () => { try { ctrl?.abort?.(); } catch {} };
  }, [id]);

  // Fetch todos
  useEffect(() => {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    (async () => {
      setLoading((l) => ({ ...l, todos: true }));
      try {
        const r = await fetch(`/api/candidates/${id}/todos`, { signal: ctrl?.signal });
        const j = await r.json();
        if (r.ok) setTodos(j.todos || []);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") console.error(e);
      } finally {
        setLoading((l) => ({ ...l, todos: false }));
      }
    })();
    return () => { try { ctrl?.abort?.(); } catch {} };
  }, [id]);

  // Fetch posts (feedback list) — only when Feedback tab is open and panelist can see it
  useEffect(() => {
    if (!canSeeFeedback || tab !== "feedback") return;
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    (async () => {
      setLoading((l) => ({ ...l, posts: true }));
      try {
        const r = await fetch(`/api/candidates/${id}/posts`, { signal: ctrl?.signal, cache: "no-store" });
        const j = await r.json();
        if (r.ok) setPosts(j.posts || []);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") console.error(e);
      } finally {
        setLoading((l) => ({ ...l, posts: false }));
      }
    })();
    return () => { try { ctrl?.abort?.(); } catch {} };
  }, [id, canSeeFeedback, tab]);

  const name = user ? `${user.firstName} ${user.lastName}` : "—";

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-semibold">{name}</h1>
          <p className="text-sm text-gray-500">
            {user?.company?.title || "—"} • {user?.company?.department || "—"} @ {user?.company?.name || "—"}
          </p>
        </div>
        <div className="text-xs rounded-full bg-gray-100 px-3 py-1">
          {role.toUpperCase()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <TabBtn active={tab === "profile"} onClick={() => setTab("profile")} label="Profile" />
        <TabBtn active={tab === "schedule"} onClick={() => setTab("schedule")} label="Schedule" />
        {canSeeFeedback && (
          <TabBtn active={tab === "feedback"} onClick={() => setTab("feedback")} label="Feedback" />
        )}
      </div>

      {/* Panels */}
      {tab === "profile" && (
        <section className="space-y-4">
          {loading.profile && <p className="text-sm text-gray-500">Loading profile…</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info label="Email" value={user?.email} />
            <Info label="Phone" value={user?.phone} />
            <Info label="Gender" value={user?.gender} />
            <Info label="Age" value={String(user?.age ?? "—")} />
            <Info label="Department" value={user?.company?.department} />
            <Info label="Title" value={user?.company?.title} />
          </div>

          {/* Resume (demo) */}
          <div className="mt-2">
            <h3 className="font-medium mb-2">Resume</h3>
            <div className="rounded border p-3 text-sm text-gray-600">
              <p>No resume uploaded. (Demo)</p>
            </div>
          </div>
        </section>
      )}

      {tab === "schedule" && (
        <section className="space-y-3">
          {loading.todos && <p className="text-sm text-gray-500">Loading schedule…</p>}
          {todos.length === 0 && !loading.todos && (
            <p className="text-sm text-gray-500">No tasks/interviews.</p>
          )}
          <ul className="divide-y rounded border">
            {todos.map((t) => (
              <li key={t.id} className="px-3 py-2 flex items-center justify-between">
                <span className="text-sm">{t.todo}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    t.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.completed ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "feedback" && canSeeFeedback && (
        <section className="space-y-4">
          {/* Panelist-only submit form */}
          {canSubmitFeedback ? (
            <FeedbackForm
              candidateId={id}
              onSubmitted={() => {
                // refresh list after submission
                fetch(`/api/candidates/${id}/posts`, { cache: "no-store" })
                  .then((r) => r.json())
                  .then((j) => setPosts(j.posts || []));
              }}
            />
          ) : (
            <div className="rounded border p-3 text-sm text-gray-600">
              You have read-only access to feedback.
            </div>
          )}

          {/* Feedback list */}
          <div>
            <h3 className="font-medium mb-2">Feedback</h3>
            {loading.posts && <p className="text-sm text-gray-500">Loading feedback…</p>}
            {posts.length === 0 && !loading.posts && (
              <p className="text-sm text-gray-500">No feedback yet.</p>
            )}
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{p.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm transition ${
        active ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{value || "—"}</div>
    </div>
  );
}
