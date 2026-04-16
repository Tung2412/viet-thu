import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Layout,
  Lightbulb,
  Loader2,
  Trophy,
  X,
} from "lucide-react";

const promptData = {
  en: "You have received a letter from an English friend, Helen. She is going to visit Hanoi in June. Write a letter to give her some suggestions. In your letter, you should tell her:\n- Where to stay\n- What dishes to try\n- Which places to visit\n- What to wear when visiting Hanoi",
  vn: "Bạn nhận được một bức thư từ một người bạn người Anh, Helen. Cô ấy dự định đến thăm Hà Nội vào tháng 6. Hãy viết một bức thư để cho cô ấy một số gợi ý. Trong thư, bạn nên nói cho cô ấy biết:\n- Nơi ở\n- Các món ăn nên thử\n- Những địa điểm nên đến tham quan\n- Nên mặc gì khi đến thăm Hà Nội",
};

const lessonData = [
  { vn: "Gửi Helen thân mến,", en: "Dear Helen,", para: 1, alts: ["Hi Helen,", "Hello Helen,"], structures: ["Dear {+ [Tên người nhận]},"] },
  { vn: "Dạo này bạn thế nào rồi?", en: "How have you been lately?", para: 2, alts: ["How are you?", "How are you doing?", "How have you been?"], structures: ["How have you been {[trạng từ thời gian]}?", "How are things going?"] },
  { vn: "Chúng ta đã không gặp nhau một thời gian dài rồi.", en: "We haven’t seen each other for a long time.", para: 2, alts: ["Long time no see.", "It has been a long time since we last met.", "We have not seen each other for a long time."], structures: ["We haven't {+ V3/ed} for a long time.", "It has been a long time since..."] },
  { vn: "Tôi hy vọng mọi việc vẫn tốt đẹp với bạn và gia đình.", en: "I hope everything goes well with you and your family.", para: 2, alts: ["I hope you and your family are doing well.", "I hope you and your family are well.", "I hope everything is going well with you and your family."], structures: ["I hope everything goes well with...", "I hope you and your family are {+ V-ing/Adj}..."] },
  { vn: "Tôi rất vui khi nghe tin bạn dự định đến thăm Hà Nội vào tháng 6 này.", en: "I’m glad to hear that you are planning to visit Hanoi this June.", para: 3, alts: ["I am happy to hear that you are going to visit Hanoi this June.", "I am very happy to know you will visit Hanoi in June.", "I am glad to hear that you are going to visit Hanoi this June."], structures: ["I'm glad to hear that {+ S + V}...", "It's great to know that you are {+ V-ing}..."] },
  { vn: "Vì vậy, tôi viết thư này để cho bạn một số lời khuyên và gợi ý cho chuyến đi của bạn.", en: "Therefore, I’m writing to give you some advice and recommendations for your trip.", para: 3, alts: ["So I am writing to give you some advice and recommendations for your trip.", "Therefore I am writing this letter to give you some advice for your trip."], structures: ["Therefore, I'm writing to give you some advice for...", "So, I write this letter to {+ V}..."] },
  { vn: "Về nơi ở, tôi khuyên bạn nên ở một khách sạn gần trung tâm thành phố vì nó gần nhiều điểm du lịch ở Hà Nội, điều này rất thuận tiện cho việc ngắm cảnh.", en: "Regarding where to stay, I recommend staying in a hotel near the city center because it’s close to many tourist attractions in Hanoi, which is very convenient for sightseeing.", para: 4, alts: [], structures: ["Regarding where to stay, I recommend {+ V-ing}...", "As for accommodation, you should stay..."] },
  { vn: "Về phần thức ăn, bạn nhất định phải thử Phở, một món ăn truyền thống của Việt Nam.", en: "As for food, you definitely must try Pho, which is a traditional dish of Vietnam.", para: 4, alts: ["About food, you must try Pho, which is a traditional dish of Vietnam."], structures: ["As for food, you definitely must try...", "When it comes to food, don't miss..."] },
  { vn: "Nó rất ngon và có hương vị độc đáo.", en: "It’s very tasty and it has a unique flavor.", para: 4, alts: ["It is very delicious and has a unique taste.", "It is very tasty and has a unique flavor."], structures: ["It is very tasty and it has...", "It's delicious with a unique..."] },
  { vn: "Bạn cũng có thể thử bánh mì.", en: "You can also try banh mi.", para: 4, alts: ["You should also try banh mi."], structures: ["You can also try {+ [Món ăn]}.", "I also suggest trying..."] },
  { vn: "Đó là một trong những món ăn đường phố ngon nhất ở đất nước tôi.", en: "It’s one of the best street foods in my country.", para: 4, alts: ["It is one of the best street foods in my country."], structures: ["It is one of the best {+ N(số nhiều)} in...", "It's a famous street food here."] },
  { vn: "Nếu bạn đang suy nghĩ về nơi để tham quan, tôi khuyên bạn nên đến thăm Hồ Hoàn Kiếm.", en: "If you are thinking about where to visit, I recommend visiting Hoan Kiem Lake.", para: 5, alts: [], structures: ["If you are thinking about where to visit, I recommend {+ V-ing}...", "For sightseeing, you should visit..."] },
  { vn: "Đó là một hồ nước khổng lồ ở giữa thành phố.", en: "It’s a huge lake in the middle of the city.", para: 5, alts: ["It is a big lake in the center of the city.", "It is a huge lake in the middle of the city."], structures: ["It's a huge lake in the middle of...", "It is a large lake located in..."] },
  { vn: "Khi bạn đến đó, bạn có thể tận hưởng không khí trong lành và cảm thấy hòa mình vào thiên nhiên.", en: "When you get there, you can enjoy the fresh air and feel connected to nature.", para: 5, alts: [], structures: ["When you get there, you can {+ V}...", "There, you can enjoy..."] },
  { vn: "Về quần áo, tôi nghĩ bạn nên mang theo một số quần áo nhẹ và thoải mái như áo thun hoặc quần đùi vì thời tiết trong tháng 6 nóng và ẩm.", en: "About clothes, I think you should pack some light and comfortable clothes like T-shirts or shorts since the weather during June is hot and humid.", para: 6, alts: [], structures: ["About clothes, I think you should pack...", "Since the weather is {[Adj]}, you'd better wear..."] },
  { vn: "Đừng quên mang theo kem chống nắng để bảo vệ bản thân khỏi ánh nắng chói chang.", en: "Don’t forget to bring your sunscreen to protect yourself from strong sunlight.", para: 6, alts: ["Do not forget to bring your sunscreen to protect yourself from strong sunlight."], structures: ["Don't forget to bring {+ N} to {+ V}...", "Remember to take..."] },
  { vn: "Đừng ngại hỏi tôi nếu bạn có bất kỳ câu hỏi nào.", en: "Feel free to ask me if you have any questions.", para: 7, alts: ["Don't hesitate to ask me if you have any questions.", "Do not hesitate to ask me if you have any questions."], structures: ["Feel free to ask me if...", "Don't hesitate to contact me if..."] },
  { vn: "Tôi rất mong sớm nhận được hồi âm từ bạn.", en: "I’m looking forward to hearing from you soon.", para: 7, alts: ["I look forward to hearing from you soon.", "I am looking forward to hearing from you soon."], structures: ["I'm looking forward to {+ V-ing}...", "I hope to hear from you soon."] },
  { vn: "Chúc mọi điều tốt lành,", en: "Best wishes,", para: 8, alts: ["Best regards,", "Warm regards,"], structures: ["Best wishes,", "Warm regards,"] },
];

const AI_ENDPOINT = "/.netlify/functions/check-sentence";

const cleanText = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^\w\s\d']/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const arr = [];
  for (let i = 0; i <= t.length; i += 1) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j += 1) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1),
            );
    }
  }

  return arr[t.length][s.length];
};

const renderStructureText = (text) => {
  const parts = text.split(/(\{.*?\})/g);
  return parts.map((part, index) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      return (
        <span key={index} className="font-bold text-red-400">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const renderPromptWithLines = (text) =>
  text.split("\n").map((line, idx) => (
    <div
      key={idx}
      className={line.trim().startsWith("-") ? "mb-1.5 ml-4 flex items-start" : "mb-2.5"}
    >
      {line}
    </div>
  ));

const normalizeFeedback = (result, targetSentence) => ({
  isAccepted: Boolean(result?.isAccepted),
  explanation: result?.explanation || "Mình chưa chấm được câu này.",
  suggestion: result?.suggestion || `Bạn có thể tham khảo câu mẫu: "${targetSentence}"`,
  errorWords: Array.isArray(result?.errorWords) ? result.errorWords : [],
});

const checkSentenceWithAI = async ({ input, targetEn, targetVn }) => {
  const response = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input, targetEn, targetVn }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || "Không kết nối được hệ thống chấm bài.");
  }

  return data;
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [completedSentences, setCompletedSentences] = useState([]);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const dictRef = useRef(new Set());
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const checkCache = useRef({});
  const isCompletedAll = currentStep >= lessonData.length;

  useEffect(() => {
    lessonData.forEach((data) => {
      [data.en, ...(data.alts || []), ...(data.structures || [])].forEach((sentence) => {
        cleanText(sentence)
          .split(" ")
          .forEach((word) => {
            if (word) {
              dictRef.current.add(word);
            }
          });
      });
    });

    fetch("https://cdn.jsdelivr.net/gh/first20hours/google-10000-english@master/google-10000-english-no-swears.txt")
      .then((res) => res.text())
      .then((text) => {
        text.split("\n").forEach((word) => {
          if (word.trim()) {
            dictRef.current.add(word.trim().toLowerCase());
          }
        });
      })
      .catch(() => {
        // Nếu từ điển ngoài lỗi mạng, ứng dụng vẫn hoạt động với từ điển cục bộ.
      });
  }, []);

  useEffect(() => {
    const element = document.getElementById(`vn-sentence-${currentStep}`);
    if (element) {
      window.setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }

    setFeedbackData(null);
    setUserInput("");
    setActivePopup(null);
    setShowHelp(false);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [currentStep]);

  const findSpellErrors = (inputTokens) => {
    const errors = [];
    let isNextWordCapitalized = true;
    const properNouns = ["helen", "hanoi", "vietnam", "pho", "hoan", "kiem", "english", "june"];
    const commonCompounds = [
      "everything",
      "everyone",
      "everywhere",
      "anything",
      "anyone",
      "anywhere",
      "something",
      "someone",
      "somewhere",
      "nothing",
      "nobody",
      "nowhere",
      "without",
      "inside",
      "outside",
      "cannot",
      "maybe",
      "into",
      "onto",
      "upon",
      "whenever",
      "whatever",
      "whoever",
      "whichever",
      "somehow",
      "anyhow",
    ];
    const currentExpectedWords = Array.from(
      new Set(lessonData[currentStep]?.en.split(" ").map((word) => cleanText(word))),
    );

    for (let i = 0; i < inputTokens.length; i += 1) {
      const token = inputTokens[i];
      if (/\s+/.test(token) || token.length === 0) {
        continue;
      }

      const isLastToken = i === inputTokens.length - 1;
      const containsVietnamese =
        /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
          token,
        );

      if (/^[.,?!-]/.test(token) && i > 0 && /\s+/.test(inputTokens[i - 1])) {
        if (!isLastToken) {
          errors.push({ tokenIndex: i, typed: token, expected: "(Xóa khoảng trắng)" });
        }
        if (/[.?!]+/.test(token)) {
          isNextWordCapitalized = true;
        }
        continue;
      }

      const match = token.match(/^([^\s.,?!-]+)(.*)$/);
      const wordPart = match ? match[1] : token;
      const punctPart = match ? match[2] : "";
      const hasLetters = /\p{L}/u.test(wordPart);

      if (hasLetters) {
        const cleanWordLower = cleanText(wordPart);
        const isProperNoun = properNouns.includes(cleanWordLower);
        const isPronounI = cleanWordLower === "i";
        const needsCaps = isNextWordCapitalized || isProperNoun || isPronounI;

        let corrected = wordPart;
        let isUnknown = false;
        let isSplitWordError = false;

        if (i + 2 < inputTokens.length && !isLastToken) {
          const nextToken = inputTokens[i + 2];
          const nextWordMatch = nextToken.match(/^([^\s.,?!-]+)/);
          if (nextWordMatch) {
            const nextClean = cleanText(nextWordMatch[1]);
            const combined = cleanWordLower + nextClean;
            if (currentExpectedWords.includes(combined) || commonCompounds.includes(combined)) {
              isSplitWordError = true;
              corrected = `${combined} (Viết liền)`;
              isUnknown = true;
            }
          }
        }

        if (containsVietnamese && !isSplitWordError) {
          isUnknown = true;
          errors.push({ tokenIndex: i, typed: token, expected: "(Ký tự lạ)" });
        } else if (isSplitWordError) {
          errors.push({ tokenIndex: i, typed: token, expected: corrected });
        } else if (cleanWordLower && !dictRef.current.has(cleanWordLower) && !isLastToken) {
          let bestMatch = null;
          let minDist = Infinity;

          for (const target of currentExpectedWords) {
            const dist = levenshteinDistance(cleanWordLower, target);
            if (dist < minDist) {
              minDist = dist;
              bestMatch = target;
            }
          }

          if (minDist <= 2 && bestMatch) {
            corrected = bestMatch;
          } else {
            isUnknown = true;
            errors.push({ tokenIndex: i, typed: token, expected: "(Sai chính tả)" });
          }
        }

        if (!isUnknown && !isLastToken) {
          let finalWord = corrected;
          if (needsCaps) {
            finalWord = finalWord.charAt(0).toUpperCase() + finalWord.slice(1);
          }
          if (finalWord !== wordPart) {
            errors.push({ tokenIndex: i, typed: token, expected: finalWord + punctPart });
          }
        }
      }

      if (/[.?!]+$/.test(token)) {
        isNextWordCapitalized = true;
      } else if (hasLetters) {
        isNextWordCapitalized = false;
      }
    }

    return errors;
  };

  const handleInputInteraction = (event) => {
    if (isCompletedAll) {
      return;
    }

    const tokens = userInput.split(/(\s+)/);
    const errors = findSpellErrors(tokens);
    let currentPos = 0;

    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      const end = currentPos + token.length;
      if (event.target.selectionStart >= currentPos && event.target.selectionStart <= end) {
        const errMatch = errors.find((error) => error.tokenIndex === i);
        if (errMatch) {
          const rect = document.getElementById(`err-token-${i}`)?.getBoundingClientRect();
          if (rect) {
            setActivePopup({
              ...errMatch,
              rect: { top: rect.top, left: rect.left + rect.width / 2 },
            });
          }
        }
        break;
      }
      currentPos = end;
    }
  };

  const moveToNextSentence = () => {
    setCompletedSentences((prev) => [...prev, userInput.trim()]);
    setCurrentStep((prev) => prev + 1);
  };

  const handleCheck = async () => {
    if (!userInput.trim() || isCompletedAll || isChecking) {
      return;
    }

    const cleanInput = cleanText(userInput);
    const currentLesson = lessonData[currentStep];
    const spellErrors = findSpellErrors(userInput.split(/(\s+)/));

    if (spellErrors.length > 0) {
      setFeedbackData({
        explanation: "Bài làm có lỗi chính tả hoặc quy tắc dấu câu cần xử lý.",
        suggestion: "Hãy sửa những từ được gạch chân đỏ trước.",
        errorWords: [],
      });
      return;
    }

    const isMatch =
      cleanInput === cleanText(currentLesson.en) ||
      (currentLesson.alts || []).some((alt) => cleanText(alt) === cleanInput);

    if (isMatch) {
      moveToNextSentence();
      return;
    }

    const cacheKey = `${currentStep}:${cleanInput}`;
    const cachedResult = checkCache.current[cacheKey];
    if (cachedResult) {
      const normalized = normalizeFeedback(cachedResult, currentLesson.en);
      if (normalized.isAccepted) {
        moveToNextSentence();
      } else {
        setFeedbackData(normalized);
      }
      return;
    }

    setIsChecking(true);
    setFeedbackData(null);
    setShowHelp(false);
    setActivePopup(null);

    try {
      const result = await checkSentenceWithAI({
        input: userInput,
        targetEn: currentLesson.en,
        targetVn: currentLesson.vn,
      });
      const normalized = normalizeFeedback(result, currentLesson.en);
      checkCache.current[cacheKey] = normalized;

      if (normalized.isAccepted) {
        moveToNextSentence();
      } else {
        setFeedbackData(normalized);
      }
    } catch (error) {
      setFeedbackData({
        explanation: "Chưa kết nối được phần chấm AI.",
        suggestion:
          error instanceof Error
            ? error.message
            : `Tạm thời bạn có thể tham khảo câu mẫu: "${currentLesson.en}"`,
        errorWords: [],
      });
    } finally {
      setIsChecking(false);
    }
  };

  const renderOverlayTokens = () => {
    if (isCompletedAll) {
      return null;
    }

    const tokens = userInput.split(/(\s+)/);
    const spellErrors = findSpellErrors(tokens);
    const aiErrorWords = feedbackData?.errorWords?.map((word) => cleanText(word)) || [];

    return tokens.map((token, index) => {
      if (/\s+/.test(token) || token.length === 0) {
        return <span key={index}>{token}</span>;
      }
      if (feedbackData && aiErrorWords.includes(cleanText(token))) {
        return (
          <span
            key={index}
            className="underline underline-offset-[3px] decoration-[2px] decoration-red-400 underline-wavy rounded-sm bg-red-50 text-transparent"
          >
            {token}
          </span>
        );
      }

      const err = spellErrors.find((error) => error.tokenIndex === index);
      if (err) {
        return (
          <span key={index} id={`err-token-${index}`} className="relative inline-block text-transparent">
            <span className="underline decoration-[2px] decoration-red-400 underline-offset-[4px]">
              {token}
            </span>
          </span>
        );
      }

      return (
        <span key={index} className="text-transparent">
          {token}
        </span>
      );
    });
  };

  const progressPercent = Math.round((currentStep / lessonData.length) * 100);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900 selection:bg-indigo-100 font-typewriter">
      <header className="z-50 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-100">
            <Layout size={20} />
          </div>
          <div>
            <h1 className="leading-none font-bold text-slate-800">VSTEP Writing Task 01</h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Đúng ý là qua, sửa đúng chỗ là chuẩn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-500">
              Hoàn thành: {progressPercent}%
            </span>
            <div className="mt-1.5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-10 pb-48">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="flex items-start gap-5 rounded-2xl bg-slate-800 p-6 text-white shadow-2xl">
            <div className="shrink-0 rounded-xl bg-white/10 p-3">
              <BookOpen size={24} className="text-indigo-300" />
            </div>
            <div className="w-full flex-1">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                Đề bài thi thực tế
              </h3>
              <div className="text-[15px] leading-relaxed font-medium opacity-90">
                {renderPromptWithLines(promptData.en)}
              </div>
            </div>
          </div>

          <div className="relative min-h-[70vh] overflow-hidden rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] lg:p-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
                backgroundSize: "100% 1.5em",
              }}
            />

            <div className="relative z-10 text-justify text-[17px] leading-[1.5] text-slate-800 lg:text-[19px]">
              {[...new Set(lessonData.map((item) => item.para))].map((paragraphNumber) => (
                <p key={paragraphNumber} className="mb-3 last:mb-0 text-justify">
                  {(() => {
                    const paragraphItems = lessonData.filter((it) => it.para === paragraphNumber);

                    return paragraphItems.map((item, localIndex) => {
                      const idx = lessonData.indexOf(item);
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;

                      const spaceAfter = localIndex < paragraphItems.length - 1 ? " " : "";

                      if (isCompleted) {
                        return (
                          <React.Fragment key={idx}>
                            <span className="inline animate-sentence-reveal font-lexend-normal font-bold text-indigo-700 underline decoration-1 decoration-indigo-200/50 underline-offset-4">
                              {completedSentences[idx]}
                            </span>
                            {spaceAfter}
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={idx}>
                          <span
                            id={`vn-sentence-${idx}`}
                            className={`inline rounded px-1 py-0.5 font-lexend-normal transition-colors duration-300 box-decoration-clone ${
                              isCurrent
                                ? "bg-rose-50 font-bold text-rose-600 ring-1 ring-rose-200 shadow-sm"
                                : "pointer-events-none font-medium text-slate-400"
                            }`}
                          >
                            {item.vn}
                          </span>
                          {spaceAfter}
                        </React.Fragment>
                      );
                    });
                  })()}

                  {lessonData.some(
                    (item) => item.para === paragraphNumber && lessonData.indexOf(item) === currentStep,
                  ) &&
                    !isCompletedAll && (
                      <span className="inline-block h-5 w-1.5 animate-pulse rounded-full bg-rose-500 align-middle" />
                    )}
                </p>
              ))}

              {isCompletedAll && (
                <div className="mt-12 animate-zoom-in rounded-[40px] border border-indigo-100 bg-indigo-50 p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl bg-white shadow-xl">
                    <Trophy size={40} className="text-indigo-600" />
                  </div>
                  <h2 className="mb-2 text-2xl font-black text-slate-800">
                    Hoàn thành Email xuất sắc!
                  </h2>
                  <p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
                    Bạn đã chuyển đổi thành công dàn ý tiếng Việt thành một bức thư tiếng Anh chuẩn xác.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-2xl bg-indigo-600 px-10 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700 active:scale-95"
                  >
                    Luyện tập đề tiếp theo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {!isCompletedAll && (
        <div className="fixed bottom-0 left-1/2 z-[9000] flex w-full max-w-4xl -translate-x-1/2 flex-col items-center gap-3 px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
          {feedbackData && (
            <div className="relative w-full overflow-hidden rounded-[20px] border border-rose-100 bg-white p-4 shadow-[0_-10px_40px_-10px_rgba(225,29,72,0.15)] animate-slide-up sm:rounded-[24px] sm:p-6">
              <div className="absolute top-0 left-0 h-full w-2 bg-rose-500" />
              <button
                onClick={() => setFeedbackData(null)}
                className="absolute top-3 right-3 text-slate-300 hover:text-slate-500 sm:top-4 sm:right-4"
              >
                <X size={18} />
              </button>
              <div className="flex gap-3 sm:gap-5">
                <div className="hidden shrink-0 rounded-2xl bg-rose-50 p-3 text-rose-500 sm:block">
                  <AlertCircle size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-500 sm:hidden" />
                    <h4 className="text-sm font-bold text-slate-800 sm:text-base">Có một chút nhầm lẫn</h4>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed font-medium text-rose-600 sm:text-sm">
                    {feedbackData.explanation}
                  </p>
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:mt-4 sm:gap-3 sm:rounded-2xl sm:p-4">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-indigo-500 sm:size-[18px]" />
                    <p className="text-[13px] leading-relaxed text-slate-700 sm:text-[14px]">
                      <span className="mb-1 block text-[10px] font-bold font-sans uppercase tracking-widest text-indigo-600">
                        Gợi ý sửa
                      </span>
                      {feedbackData.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex w-full flex-col rounded-[22px] border border-slate-200 bg-white/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all sm:rounded-[28px]">
            <div className="flex items-stretch p-2">
              <div className="relative flex shrink-0 items-center border-r border-slate-200/60 pr-2 font-sans">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-[18px] px-3 font-bold transition sm:px-5 ${
                    showHelp ? "bg-indigo-600 text-white shadow-lg" : "text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <span className="text-[22px] leading-none sm:text-[26px]">🥲</span>
                  <span className="text-[9px] uppercase tracking-widest sm:text-[10px]">Gợi ý</span>
                </button>

                {showHelp && (
                  <div className="absolute bottom-[calc(100%+16px)] left-0 z-[100] flex max-w-[90vw] flex-col-reverse gap-2 sm:gap-3">
                    {lessonData[currentStep].structures.map((structure, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded-[16px] border border-slate-700 bg-slate-900 px-4 py-3 text-[13px] text-white shadow-2xl ring-1 ring-white/10 animate-slide-up font-typewriter sm:whitespace-nowrap sm:rounded-[20px] sm:px-6 sm:py-4 sm:text-[15px]"
                      >
                        <span className="mr-3 shrink-0 rounded bg-indigo-500/10 px-2 py-1 text-[9px] font-black font-sans uppercase tracking-[0.2em] text-indigo-400 sm:mr-4 sm:text-[10px]">
                          P{index + 1}
                        </span>
                        <span className="font-medium tracking-wide">{renderStructureText(structure)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative mx-2 my-1 min-h-[60px] flex-1 rounded-[16px] border border-slate-200 bg-white shadow-inner transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 sm:mx-2.5 sm:my-1.5 sm:min-h-[76px] sm:rounded-[18px]">
                <div
                  ref={overlayRef}
                  className="pointer-events-none absolute inset-0 overflow-hidden break-words px-4 py-2.5 whitespace-pre-wrap sm:px-5 sm:py-3"
                  style={{ lineHeight: "24px", fontSize: "16px", fontFamily: "inherit" }}
                >
                  {renderOverlayTokens()}
                </div>

                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(event) => {
                    setUserInput(event.target.value);
                    setActivePopup(null);
                    setShowHelp(false);
                  }}
                  onClick={handleInputInteraction}
                  onKeyUp={handleInputInteraction}
                  onScroll={(event) => {
                    if (overlayRef.current) {
                      overlayRef.current.scrollTop = event.target.scrollTop;
                    }
                    setActivePopup(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleCheck();
                    }
                  }}
                  placeholder="Viết bản dịch tiếng Anh..."
                  className="absolute inset-0 h-full w-full resize-none break-words bg-transparent px-4 py-2.5 text-[16px] leading-[24px] font-bold text-slate-800 outline-none placeholder:text-slate-400 whitespace-pre-wrap overflow-y-auto font-typewriter sm:px-5 sm:py-3 sm:text-[18px]"
                  spellCheck={false}
                />
              </div>

              <button
                onClick={handleCheck}
                disabled={!userInput.trim() || isChecking}
                className="my-1 mr-1 flex shrink-0 flex-col items-center justify-center gap-1 rounded-[18px] bg-indigo-600 px-4 font-black font-sans text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 sm:min-w-[110px] sm:rounded-[22px] sm:px-7 sm:gap-1.5"
              >
                {isChecking ? (
                  <Loader2 size={22} className="animate-spin sm:size-[26px]" />
                ) : (
                  <>
                    <CheckCircle size={22} className="sm:size-[26px]" />
                    <span className="text-[9px] uppercase tracking-widest sm:text-[11px]">Nộp bài</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup && activePopup.rect && !isChecking && !feedbackData && (
        <div
          className="pointer-events-none fixed z-[99999] flex items-center gap-3 whitespace-nowrap rounded-2xl bg-slate-900 px-4 py-2.5 text-[15px] text-white shadow-2xl ring-1 ring-white/20 animate-fade-in font-typewriter"
          style={{
            top: activePopup.rect.top,
            left: activePopup.rect.left,
            transform: "translate(-50%, calc(-100% - 10px))",
          }}
        >
          {activePopup.expected.includes("Xóa") ? (
            <span className="font-bold text-amber-400">{activePopup.expected}</span>
          ) : activePopup.expected.includes("Sai") ? (
            <span className="font-bold text-rose-400">{activePopup.expected}</span>
          ) : (
            <>
              <span className="font-medium text-slate-500 line-through">{activePopup.typed}</span>
              <ArrowRight size={14} className="text-indigo-400" />
              <span className="font-bold text-emerald-400">{activePopup.expected}</span>
            </>
          )}
          <div className="absolute top-full left-1/2 -mt-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-slate-900 ring-b ring-r ring-white/20" />
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        body, * {
          font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif !important;
        }
        .font-typewriter, textarea, input, .font-serif {
          font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif !important;
          font-weight: 500;
        }
        .font-lexend-normal {
          font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif !important;
          font-weight: 400;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, calc(-100% - 0px)) scale(0.95); } to { opacity: 1; transform: translate(-50%, calc(-100% - 10px)) scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes revealEnglish {
          0% { opacity: 0; color: #e11d48; }
          50% { color: #4f46e5; }
          100% { opacity: 1; }
        }

        .animate-fade-in { animation: fadeIn 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-zoom-in { animation: zoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-sentence-reveal { animation: revealEnglish 0.6s ease-out forwards; display: inline; }
        .underline-wavy { text-decoration-style: wavy; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        body { background-color: #F1F5F9; margin: 0; }
      `,
        }}
      />
    </div>
  );
}
