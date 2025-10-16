"use client";

import { useMemo, useState } from "react";

type Props = {
  candidateId: number;
  onSubmitted?: () => void;
};

export default function FeedbackForm({ candidateId, onSubmitted }: Props) {
  const [score, setScore] = useState<string>("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");

  // Track if user interacted with fields
  const [touched, setTouched] = useState({
    score: false,
    strengths: false,
    improvements: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  // ---- validation ----
  const scoreNum = Number(score);
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!score || Number.isNaN(scoreNum) || !Number.isInteger(scoreNum)) {
      e.score = "Score must be an integer.";
    } else if (scoreNum < 1 || scoreNum > 10) {
      e.score = "Score must be between 1 and 10.";
    }
    if (!strengths.trim() || strengths.trim().length < 10) {
      e.strengths = "Please enter at least 10 characters.";
    }
    if (!improvements.trim() || improvements.trim().length < 10) {
      e.improvements = "Please enter at least 10 characters.";
    }
    return e;
  }, [score, strengths, improvements]);

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setServerErr(null);

    try {
      const res = await fetch(`/api/candidates/${candidateId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overallScore: scoreNum,
          strengths,
          improvements,
        }),
      });

      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Failed to submit feedback");

      // reset
      setScore("");
      setStrengths("");
      setImprovements("");
      setTouched({ score: false, strengths: false, improvements: false });

      onSubmitted?.();
    } catch (err: any) {
      setServerErr(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="rounded border p-3 grid gap-3" onSubmit={handleSubmit} noValidate>
      <h3 className="font-medium">Submit Feedback</h3>

      {/* Overall Score */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Overall Score (1–10)</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          min={1}
          max={10}
          step={1}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, score: true }))}
          className={`border rounded px-3 py-2 ${
            touched.score && errors.score ? "border-red-400" : ""
          }`}
          placeholder="e.g. 7"
          aria-invalid={!!errors.score}
        />
        {touched.score && errors.score && (
          <p className="text-xs text-red-500">{errors.score}</p>
        )}
      </div>

      {/* Strengths */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Strengths</label>
        <textarea
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, strengths: true }))}
          className={`border rounded px-3 py-2 min-h-[90px] ${
            touched.strengths && errors.strengths ? "border-red-400" : ""
          }`}
          placeholder="What went well? Key positives…"
          aria-invalid={!!errors.strengths}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{strengths.trim().length} / 500</span>
          {touched.strengths && errors.strengths && (
            <span className="text-red-500">{errors.strengths}</span>
          )}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Areas for Improvement</label>
        <textarea
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, improvements: true }))}
          className={`border rounded px-3 py-2 min-h-[90px] ${
            touched.improvements && errors.improvements ? "border-red-400" : ""
          }`}
          placeholder="Where can they improve? Actionable suggestions…"
          aria-invalid={!!errors.improvements}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{improvements.trim().length} / 500</span>
          {touched.improvements && errors.improvements && (
            <span className="text-red-500">{errors.improvements}</span>
          )}
        </div>
      </div>

      {serverErr && <div className="text-sm text-red-600">{serverErr}</div>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className={`rounded px-4 py-2 text-white transition ${
            !isValid || submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-brand-green hover:shadow-lg"
          }`}
          title={!isValid ? "Please fix validation errors" : "Submit feedback"}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
