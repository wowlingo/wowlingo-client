import { useRef, useState } from "react";
import { PLANET_LAYOUT } from "./model/constants";
import { QUESTION } from "./model/questions.mock";
import type { PlanetStatus } from "./model/types";
import Planet from "./components/Planet";
import RocketIcon from "./icons/RocketIcon";

type Phase = "idle" | "firing" | "result";

function centerOf(el: HTMLElement, base: DOMRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - base.left + r.width / 2,
    y: r.top - base.top + r.height / 2,
  };
}

export default function SpacePlanetQuestion() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const rocketRef = useRef<HTMLDivElement | null>(null);
  const planetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setPlanetRef = (id: string, el: HTMLDivElement | null) => {
    planetRefs.current[id] = el;
  };

  const [phase, setPhase] = useState<Phase>("idle");
  const [selected, setSelected] = useState<string | null>(null);

  const [resultMap, setResultMap] = useState<Record<string, PlanetStatus>>({
    a: "idle",
    b: "idle",
    c: "idle",
  });

  // 레이저(빔) 상태
  const [beam, setBeam] = useState<{
    x: number;
    y: number;
    angle: number;
    length: number;
  } | null>(null);
  const [beamLength, setBeamLength] = useState(0);

  const correctId = QUESTION.correctId;

  const onSelect = (id: string) => {
    if (phase !== "idle") return;

    const container = sceneRef.current;
    const rocket = rocketRef.current;
    const target = planetRefs.current[id!];
    if (!container || !rocket || !target) return;

    const base = container.getBoundingClientRect();
    const s = centerOf(rocket, base);
    const t = centerOf(target, base);
    const angle = Math.atan2(t.y - s.y, t.x - s.x) * (180 / Math.PI);
    const length = Math.hypot(t.x - s.x, t.y - s.y);

    setSelected(id);
    setPhase("firing");

    // 초기 빔(길이 0) → 다음 프레임에 실제 길이로 확장
    setBeam({ x: s.x, y: s.y, angle, length });
    setBeamLength(0);
    requestAnimationFrame(() => setBeamLength(length));
  };

  const onBeamTransitionEnd = () => {
    if (phase !== "firing" || !selected) return;
    const correct = selected === correctId;

    setResultMap({
      a:
        selected === "a"
          ? correct
            ? "correct"
            : "wrong"
          : correct
            ? "dim"
            : "idle",
      b:
        selected === "b"
          ? correct
            ? "correct"
            : "wrong"
          : correct
            ? "dim"
            : "idle",
      c:
        selected === "c"
          ? correct
            ? "correct"
            : "wrong"
          : correct
            ? "dim"
            : "idle",
    });

    setPhase("result");
  };

  const reset = () => {
    setPhase("idle");
    setSelected(null);
    setBeam(null);
    setBeamLength(0);
    setResultMap({ a: "idle", b: "idle", c: "idle" });
  };

  return (
    <div className="min-h-[680px] w-full">
      {/* 상단 바 */}
      <div className="mx-auto flex max-w-[420px] items-center justify-between gap-3 rounded-xl border px-3 py-2">
        <div className="inline-flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
            ★ 모은 XP 0
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <button className="hover:text-gray-900">🔊</button>
          <button className="hover:text-gray-900">나가기</button>
        </div>
      </div>

      {/* 씬 영역 */}
      <div
        ref={sceneRef}
        className="relative mx-auto mt-4 h-[560px] w-full max-w-[420px] overflow-hidden rounded-3xl border bg-gray-100"
      >
        {/* 장식 소행성 */}
        <div className="absolute left-6 top-10 h-3 w-3 rounded-full bg-black/70" />
        <div className="absolute left-12 top-20 h-2 w-2 rounded-full bg-black/60" />
        <div className="absolute right-10 top-16 h-2 w-2 rounded-full bg-black/60" />

        {/* 행성 3개 */}
        {PLANET_LAYOUT.map((p) => {
          const choice = QUESTION.choices.find((c) => c.id === p.id)!;
          return (
            <Planet
              key={p.id}
              id={p.id}
              label={choice.label}
              status={resultMap[p.id as keyof typeof resultMap]}
              style={{ top: p.top as string, left: p.left as string }}
              onClick={onSelect}
              planetRef={setPlanetRef}
            />
          );
        })}

        {/* 로켓 */}
        <div
          ref={rocketRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <RocketIcon className="h-16 w-16 text-black" />
        </div>

        {/* 레이저(빔) */}
        {beam && (
          <div
            className="absolute h-1 origin-left rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-[width] duration-300 ease-out"
            style={{
              left: beam.x,
              top: beam.y,
              width: beamLength,
              transform: `translateY(-0.5px) rotate(${beam.angle}deg)`,
            }}
            onTransitionEnd={onBeamTransitionEnd}
          />
        )}

        {/* 하단 버튼/설명 */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 items-end gap-2 p-4">
          <div>
            <button className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
              힌트
            </button>
          </div>
          <div className="col-span-2 text-right">
            {phase === "result" ? (
              <div className="inline-flex gap-2">
                <button
                  onClick={reset}
                  className="rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
                >
                  다시하기
                </button>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700">
                  다음 문제
                </button>
              </div>
            ) : (
              <button className="rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">
                건너뛰기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 문제 텍스트 */}
      <p className="mx-auto mt-3 max-w-[420px] text-center text-sm text-gray-600">
        {QUESTION.text}
      </p>
    </div>
  );
}
