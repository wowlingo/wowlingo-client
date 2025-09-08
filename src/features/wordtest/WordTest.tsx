import { useMemo, useState } from "react";
import { QUESTIONS } from "./model/questions.mock";
import useKoreanVoice, { speakKorean } from "../../shared/hooks/useKoreanVoice";
import Option from "./components/Option";
import IconSpeaker from "@/shared/icons/IconSpeaker";
import Modal from "@/shared/ui/Modal";
import { cn } from "@/shared/lib/classNames";

export default function WordTest() {
  const total = QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const voice = useKoreanVoice();

  const current = QUESTIONS[index];
  const selectedId = answers[current.id];
  const isLast = index === total - 1;

  const score = useMemo(() => {
    let s = 0;
    for (const q of QUESTIONS) if (answers[q.id] === q.correctId) s += 1;
    return s;
  }, [answers]);

  const onSelect = (id: string) =>
    setAnswers((prev) => ({ ...prev, [current.id]: id }));
  const goNext = () => {
    if (index < total - 1) setIndex((i) => i + 1);
  };

  return (
    <div>
      {/* 제목 + 진행표시 */}
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          [단어 듣고 맞추기] 단어 테스트
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-600">
            총 {total}문항
          </span>
          <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-600">
            {index + 1}/{total}
          </span>
        </div>
      </div>

      {/* 카드 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* 상단: 문항/스피커 */}
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white">
            문항{index + 1}
          </span>
          <button
            onClick={() => speakKorean(current.ttsText, voice)}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-blue-700 hover:bg-blue-50"
            aria-label="음성 듣기"
          >
            <IconSpeaker className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">듣기</span>
          </button>
        </div>

        {/* 선택지 */}
        <div className="mt-6 space-y-4">
          {current.choices.map((c) => (
            <Option
              key={c.id}
              name={current.id}
              choice={c}
              selectedId={selectedId}
              onChange={onSelect}
            />
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {!isLast ? (
          <button
            onClick={goNext}
            disabled={!selectedId}
            className={cn(
              "inline-flex h-11 items-center rounded-xl px-5 text-white shadow-sm",
              selectedId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed",
            )}
          >
            다음
          </button>
        ) : (
          <ResultButton score={score} total={total} />
        )}
      </div>
    </div>
  );
}

function ResultButton({ score, total }: { score: number; total: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-white shadow-sm hover:bg-blue-700"
      >
        마침
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-semibold">결과</h2>
        <p className="mt-2 text-gray-700">
          점수: <span className="font-semibold text-blue-600">{score}</span> /{" "}
          {total}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            다시 하기
          </button>
        </div>
      </Modal>
    </>
  );
}
