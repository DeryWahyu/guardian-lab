import { CheckCircle2, CircleHelp } from "lucide-react";
import type { AcademyLesson, AcademyResult } from "./academy-presentation";
import styles from "./quiz-lesson.module.css";

export function QuizQuestion({
  question,
  index,
  selected,
  feedback,
  disabled,
  onChoose,
}: {
  question: AcademyLesson["questions"][number];
  index: number;
  selected: string[];
  feedback?: AcademyResult["feedback"][number];
  disabled: boolean;
  onChoose: (optionId: string) => void;
}) {
  return (
    <fieldset
      data-user-reveal
      data-user-order={index % 3}
      disabled={disabled}
      className={styles.question}
      data-feedback={feedback ? (feedback.correct ? "correct" : "review") : undefined}
    >
      <legend className="sr-only">
        Soal {index + 1}: {question.questionText}
      </legend>
      <div className={styles.questionHeading}>
        <span className={styles.questionNumber} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2>{question.questionText}</h2>
          <p>{question.multiple ? "Pilih semua jawaban yang sesuai." : "Pilih satu jawaban."}</p>
        </div>
      </div>
      <div className={styles.options}>
        {question.options.map((option) => (
          <label
            key={option.id}
            className={styles.option}
            data-selected={selected.includes(option.id)}
          >
            <input
              type={question.multiple ? "checkbox" : "radio"}
              name={question.id}
              checked={selected.includes(option.id)}
              onChange={() => onChoose(option.id)}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </div>
      {feedback && (
        <div className={styles.feedback} data-correct={feedback.correct}>
          <p>
            {feedback.correct ? (
              <CheckCircle2 aria-hidden="true" size={18} />
            ) : (
              <CircleHelp aria-hidden="true" size={18} />
            )}
            <strong>{feedback.correct ? "Jawaban benar" : "Jawaban belum tepat"}</strong>
          </p>
          <p>
            <strong>Jawaban:</strong> {feedback.correctAnswers.join("; ")}
          </p>
          <p>{feedback.explanation}</p>
        </div>
      )}
    </fieldset>
  );
}
