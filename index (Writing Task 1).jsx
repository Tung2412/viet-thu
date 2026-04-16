import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, AlertCircle, HelpCircle, X, Loader2, Trophy, Lightbulb, ArrowRight, Layout, ChevronRight } from 'lucide-react';

// --- DATA: BÀI MẪU & GỢI Ý ---
const promptData = {
  en: "You have received a letter from an English friend, Helen. She is going to visit Hanoi in June. Write a letter to give her some suggestions. In your letter, you should tell her:\n- Where to stay\n- What dishes to try\n- Which places to visit\n- What to wear when visiting Hanoi",
  vn: "Bạn nhận được một bức thư từ một người bạn người Anh, Helen. Cô ấy dự định đến thăm Hà Nội vào tháng 6. Hãy viết một bức thư để cho cô ấy một số gợi ý. Trong thư, bạn nên nói cho cô ấy biết:\n- Nơi ở\n- Các món ăn nên thử\n- Những địa điểm nên đến tham quan\n- Nên mặc gì khi đến thăm Hà Nội"
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
  { vn: "Chúc mọi điều tốt lành,", en: "Best wishes,", para: 8, alts: ["Best regards,", "Warm regards,"], structures: ["Best wishes,", "Warm regards,"] }
];

// --- UTILS ---
const cleanText = (str) => {
  return str
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[đĐ]/g, 'd')
    .replace(/[^\w\s\d']/gi, '') 
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length; if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] = i === 0 ? j : Math.min(arr[i-1][j]+1, arr[i][j-1]+1, arr[i-1][j-1]+(s[j-1]===t[i-1]?0:1));
    }
  }
  return arr[t.length][s.length];
};

const renderStructureText = (text) => {
  const parts = text.split(/(\{.*?\})/g);
  return parts.map((part, index) => {
    if (part.startsWith('{') && part.endsWith('}')) return <span key={index} className="text-red-400 font-bold">{part.slice(1, -1)}</span>;
    return <span key={index}>{part}</span>;
  });
};

const renderPromptWithLines = (text) => {
  return text.split('\n').map((line, idx) => (
    <div key={idx} className={line.trim().startsWith('-') ? "ml-4 mb-1.5 flex items-start" : "mb-2.5"}>
       {line}
    </div>
  ));
};

// ============================================================================
// COMPONENT CHÍNH
// ============================================================================
const apiKey = ""; 

const checkSentenceWithAI = async (input, targetEn, targetVn) => {
  const promptText = `Đánh giá câu tiếng Anh dịch từ: "${targetVn}". Câu mẫu: "${targetEn}". Học viên viết: "${input}". Trích xuất chính xác các từ sai grammar/vocab vào errorWords. Trả về JSON: {isAccepted, explanation, suggestion, errorWords: []}`;
  const payload = { contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json" } };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await response.json();
  return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
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
    lessonData.forEach(data => {
      [data.en, ...(data.alts || []), ...(data.structures || [])].forEach(s => {
        cleanText(s).split(' ').forEach(w => { if (w) dictRef.current.add(w); });
      });
    });
    fetch('https://cdn.jsdelivr.net/gh/first20hours/google-10000-english@master/google-10000-english-no-swears.txt')
      .then(res => res.text()).then(text => {
         text.split('\n').forEach(w => { if (w.trim()) dictRef.current.add(w.trim().toLowerCase()); });
      });
  }, []);

  useEffect(() => {
    const el = document.getElementById(`vn-sentence-${currentStep}`);
    if (el) {
       setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
    setFeedbackData(null); setUserInput(''); setActivePopup(null); setShowHelp(false);
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 150);
  }, [currentStep]);

  const findSpellErrors = (inputTokens) => {
      let errors = []; let isNextWordCapitalized = true; 
      const properNouns = ["helen", "hanoi", "vietnam", "pho", "hoan", "kiem", "english", "june"];
      const commonCompounds = ["everything", "everyone", "everywhere", "anything", "anyone", "anywhere", "something", "someone", "somewhere", "nothing", "nobody", "nowhere", "without", "inside", "outside", "cannot", "maybe", "into", "onto", "upon", "whenever", "whatever", "whoever", "whichever", "somehow", "anyhow"];
      const currentExpectedWords = Array.from(new Set(lessonData[currentStep]?.en.split(' ').map(w => cleanText(w))));
      
      for (let i = 0; i < inputTokens.length; i++) {
          const token = inputTokens[i]; if (/\s+/.test(token) || token.length === 0) continue;
          const isLastToken = i === inputTokens.length - 1;
          const containsVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(token);
          
          if (/^[.,?!\-]/.test(token) && i > 0 && /\s+/.test(inputTokens[i-1])) {
              if (!isLastToken) errors.push({ tokenIndex: i, typed: token, expected: "(Xóa khoảng trắng)" });
              if (/[.?!]+/.test(token)) isNextWordCapitalized = true; continue;
          }
          const match = token.match(/^([^\s.,?!\-]+)(.*)$/);
          const wordPart = match ? match[1] : token;
          const punctPart = match ? match[2] : "";
          const hasLetters = /\p{L}/u.test(wordPart);
          
          if (hasLetters) {
              const cleanWordLower = cleanText(wordPart);
              const isProperNoun = properNouns.includes(cleanWordLower);
              const isFirstCharUpper = /^\p{Lu}/u.test(wordPart);
              const isPronounI = cleanWordLower === 'i';
              const needsCaps = isNextWordCapitalized || isProperNoun || isPronounI;
              
              let corrected = wordPart; 
              let isUnknown = false;
              let isSplitWordError = false;

              if (i + 2 < inputTokens.length && !isLastToken) {
                  const nextToken = inputTokens[i + 2];
                  const nextWordMatch = nextToken.match(/^([^\s.,?!\-]+)/);
                  if (nextWordMatch) {
                      const nextClean = cleanText(nextWordMatch[1]);
                      const combined = cleanWordLower + nextClean;
                      if (currentExpectedWords.includes(combined) || commonCompounds.includes(combined)) {
                          isSplitWordError = true;
                          corrected = combined + " (Viết liền)";
                          isUnknown = true;
                      }
                  }
              }

              if (containsVietnamese && !isSplitWordError) { 
                  isUnknown = true; 
                  errors.push({ tokenIndex: i, typed: token, expected: "(Ký tự lạ)" }); 
              }
              else if (isSplitWordError) {
                  errors.push({ tokenIndex: i, typed: token, expected: corrected });
              }
              else if (cleanWordLower && !dictRef.current.has(cleanWordLower) && !isLastToken) {
                  let bestMatch = null, minDist = Infinity;
                  for (const target of currentExpectedWords) { 
                      const dist = levenshteinDistance(cleanWordLower, target); 
                      if (dist < minDist) { minDist = dist; bestMatch = target; } 
                  }
                  if (minDist <= 2 && bestMatch) corrected = bestMatch;
                  else { isUnknown = true; errors.push({ tokenIndex: i, typed: token, expected: "(Sai chính tả)" }); }
              }

              if (!isUnknown && !isLastToken) {
                  let final = corrected; 
                  if (needsCaps) final = final.charAt(0).toUpperCase() + final.slice(1);
                  if (final !== wordPart) errors.push({ tokenIndex: i, typed: token, expected: final + punctPart });
              }
          }
          if (/[.?!]+$/.test(token)) isNextWordCapitalized = true;
          else if (hasLetters) isNextWordCapitalized = false;
      }
      return errors;
  };

  const handleInputInteraction = (e) => {
    if (isCompletedAll) return;
    const tokens = userInput.split(/(\s+)/); const errors = findSpellErrors(tokens);
    let currentPos = 0;
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]; const end = currentPos + token.length;
        if (e.target.selectionStart >= currentPos && e.target.selectionStart <= end) {
            const errMatch = errors.find(err => err.tokenIndex === i);
            if (errMatch) {
                const rect = document.getElementById(`err-token-${i}`)?.getBoundingClientRect();
                if (rect) setActivePopup({ ...errMatch, rect: { top: rect.top, left: rect.left + rect.width/2 } });
            } break;
        } currentPos = end;
    }
  };

  const handleCheck = async () => {
    if (!userInput.trim() || isCompletedAll || isChecking) return;
    const cleanInput = cleanText(userInput);
    if (findSpellErrors(userInput.split(/(\s+)/)).length > 0) {
      setFeedbackData({ explanation: "Bài làm có lỗi chính tả hoặc quy tắc dấu câu cần xử lý.", suggestion: "Hãy sửa những từ được gạch chân đỏ trước." });
      return;
    }
    const isMatch = cleanInput === cleanText(lessonData[currentStep].en) || (lessonData[currentStep].alts || []).some(alt => cleanText(alt) === cleanInput);
    if (isMatch) { setCompletedSentences([...completedSentences, userInput.trim()]); setCurrentStep(currentStep + 1); return; }
    setIsChecking(true); setFeedbackData(null); setShowHelp(false); setActivePopup(null);
    try {
      const result = await checkSentenceWithAI(userInput, lessonData[currentStep].en, lessonData[currentStep].vn);
      if (result.isAccepted) { setCompletedSentences([...completedSentences, userInput.trim()]); setCurrentStep(currentStep + 1); }
      else setFeedbackData(result);
    } catch (e) { setFeedbackData({ explanation: "Mạng lỗi.", suggestion: `Thử gõ: "${lessonData[currentStep].en}"` }); }
    finally { setIsChecking(false); }
  };

  const renderOverlayTokens = () => {
    if (isCompletedAll) return null;
    const tokens = userInput.split(/(\s+)/); const spellErrors = findSpellErrors(tokens);
    const aiErrorWords = feedbackData?.errorWords?.map(w => cleanText(w)) || [];
    return tokens.map((token, i) => {
        if (/\s+/.test(token) || token.length === 0) return <span key={i}>{token}</span>;
        if (feedbackData && aiErrorWords.includes(cleanText(token))) return <span key={i} className="bg-red-50 decoration-red-400 decoration-[2px] underline-wavy underline underline-offset-[3px] rounded-sm text-transparent">{token}</span>;
        const err = spellErrors.find(e => e.tokenIndex === i);
        if (err) return <span key={i} id={`err-token-${i}`} className="relative text-transparent inline-block"><span className="underline decoration-red-400 decoration-[2px] underline-offset-[4px]">{token}</span></span>;
        return <span key={i} className="text-transparent">{token}</span>;
    });
  };

  const progressPercent = Math.round((currentStep / lessonData.length) * 100);

  return (
    <div className="h-screen flex flex-col bg-[#F1F5F9] text-slate-900 overflow-hidden relative selection:bg-indigo-100 font-typewriter">
      
      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-100">
            <Layout size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-none">VSTEP Writing Practice</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">Transformative Email Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Hoàn thành: {progressPercent}%</span>
            <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>
      </header>

      {/* --- CONTENT AREA: THE PAPER --- */}
      <main className="flex-1 overflow-y-auto pt-10 pb-48 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Prompt Section */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-2xl flex gap-5 items-start">
             <div className="p-3 bg-white/10 rounded-xl shrink-0"><BookOpen size={24} className="text-indigo-300"/></div>
             <div className="flex-1 w-full">
                 <h3 className="text-indigo-300 font-bold text-[11px] uppercase tracking-widest mb-3">Đề bài thi thực tế</h3>
                 <div className="text-[15px] leading-relaxed opacity-90 font-medium">
                     {renderPromptWithLines(promptData.en)}
                 </div>
             </div>
          </div>

          {/* Writing Paper Section */}
          <div className="bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 lg:p-16 min-h-[70vh] relative overflow-hidden">
             {/* Paper Lines Decoration */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 1.5em' }}></div>
             
             {/* Text flow */}
             <div className="relative z-10 text-[17px] lg:text-[19px] leading-[1.5] text-left text-slate-800">
                {[...new Set(lessonData.map(i => i.para))].map(pNum => (
                   <p key={pNum} className="mb-3 last:mb-0">
                      {lessonData.filter(i => i.para === pNum).map(item => {
                         const idx = lessonData.indexOf(item);
                         const isCompleted = idx < currentStep;
                         const isCurrent = idx === currentStep;
                         
                         if (isCompleted) return (
                            <span key={idx} className="text-indigo-700 font-bold animate-sentence-reveal inline decoration-indigo-200/50 underline underline-offset-4 decoration-1 mr-1.5">
                              {completedSentences[idx]}
                            </span>
                         );
                         
                         return (
                            <span key={idx} id={`vn-sentence-${idx}`} className={`transition-colors duration-300 rounded px-1 py-0.5 inline mr-1.5 box-decoration-clone ${isCurrent ? 'text-rose-600 font-bold bg-rose-50 ring-1 ring-rose-200 shadow-sm' : 'text-slate-400 font-medium pointer-events-none'}`}>
                               {item.vn}
                            </span>
                         );
                      })}
                      {lessonData.filter(i => i.para === pNum).some(i => lessonData.indexOf(i) === currentStep) && !isCompletedAll && (
                        <span className="inline-block w-1.5 h-5 bg-rose-500 animate-pulse align-middle ml-1 rounded-full"></span>
                      )}
                   </p>
                ))}

                {isCompletedAll && (
                  <div className="mt-12 text-center animate-zoom-in p-10 bg-indigo-50 border border-indigo-100 rounded-[40px]">
                     <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Trophy size={40} className="text-indigo-600" />
                     </div>
                     <h2 className="text-2xl font-black text-slate-800 mb-2">Hoàn thành Email xuất sắc!</h2>
                     <p className="text-slate-500 max-w-xs mx-auto mb-8 text-sm leading-relaxed">Bạn đã chuyển đổi thành công dàn ý tiếng Việt thành một bức thư tiếng Anh chuẩn xác.</p>
                     <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition shadow-xl shadow-indigo-200 active:scale-95">Luyện tập đề tiếp theo</button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>

      {/* --- MODERN FLOATING INPUT BAR --- */}
      {!isCompletedAll && (
         <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6 z-[9000] flex flex-col items-center gap-4">
            
            {/* AI Feedback Bubble */}
            {feedbackData && (
               <div className="bg-white border border-rose-100 shadow-[0_-10px_40px_-10px_rgba(225,29,72,0.15)] rounded-[24px] p-6 w-full animate-slide-up relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                  <button onClick={() => setFeedbackData(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><X size={18}/></button>
                  <div className="flex gap-5">
                     <div className="bg-rose-50 p-3 rounded-2xl text-rose-500"><AlertCircle size={24}/></div>
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-base">Có một chút nhầm lẫn</h4>
                        <p className="text-rose-600 text-sm mt-1 leading-relaxed font-medium">{feedbackData.explanation}</p>
                        <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                           <Lightbulb size={18} className="text-indigo-500 shrink-0 mt-0.5"/>
                           <p className="text-[14px] text-slate-700 leading-relaxed"><span className="font-bold text-indigo-600 uppercase text-[10px] tracking-widest block mb-1 font-sans">Gợi ý sửa</span> {feedbackData.suggestion}</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Input Form */}
            <div className="w-full bg-white/90 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] border border-slate-200 flex items-stretch p-2 transition-all">
               
               {/* Cứuuu Button */}
               <div className="relative shrink-0 flex items-center px-1 border-r border-slate-200/60 font-sans">
                  <button onClick={() => setShowHelp(!showHelp)} className={`h-full px-5 transition flex flex-col items-center justify-center rounded-[20px] font-bold gap-1 ${showHelp ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                     <span className="text-[26px] leading-none mb-0.5">🥲</span>
                     <span className="text-[10px] uppercase tracking-widest">Cứuuu</span>
                  </button>
                  
                  {showHelp && (
                     <div className="absolute bottom-[calc(100%+20px)] left-0 flex flex-col-reverse z-[100] gap-3">
                        {lessonData[currentStep].structures.map((s, i) => (
                           <div key={i} className="flex items-center bg-slate-900 text-white text-[15px] px-6 py-4 rounded-[20px] shadow-2xl border border-slate-700 whitespace-nowrap animate-slide-up ring-1 ring-white/10 font-typewriter">
                              <span className="font-black text-indigo-400 mr-4 text-[10px] uppercase tracking-[0.2em] bg-indigo-500/10 px-2 py-1 rounded font-sans">Pattern {i + 1}</span>
                              <span className="font-medium tracking-wide">{renderStructureText(s)}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Writing Area */}
               <div className="relative flex-1 bg-white mx-2.5 my-1.5 rounded-[18px] border border-slate-200 shadow-inner focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all min-h-[76px]">
                  <div ref={overlayRef} className="absolute inset-0 px-5 py-3 whitespace-pre-wrap break-words pointer-events-none overflow-hidden" style={{ lineHeight: '24px', fontSize: '18px', fontFamily: 'inherit' }}>
                     {renderOverlayTokens()}
                  </div>
                  <textarea ref={inputRef} value={userInput}
                     onChange={(e) => { setUserInput(e.target.value); setActivePopup(null); setShowHelp(false); }}
                     onClick={handleInputInteraction} onKeyUp={handleInputInteraction} 
                     onScroll={(e) => { if(overlayRef.current) overlayRef.current.scrollTop = e.target.scrollTop; setActivePopup(null); }}
                     onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCheck(); } }}
                     placeholder="Viết lời dịch tiếng Anh của dòng đỏ vào đây..."
                     className="absolute inset-0 w-full h-full px-5 py-3 bg-transparent outline-none text-slate-800 placeholder-slate-400 resize-none whitespace-pre-wrap break-words overflow-y-auto text-[18px] leading-[24px] font-typewriter font-bold"
                     spellCheck="false"
                  />
               </div>

               {/* Submit Button */}
               <button onClick={handleCheck} disabled={!userInput.trim() || isChecking} className="px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all flex flex-col items-center justify-center gap-1.5 rounded-[22px] shrink-0 min-w-[110px] shadow-lg shadow-indigo-100 disabled:bg-slate-100 disabled:text-slate-300 active:scale-95 my-1 mr-1 font-sans">
                  {isChecking ? <Loader2 size={26} className="animate-spin" /> : <><CheckCircle size={26} /><span className="text-[11px] uppercase tracking-widest">Nộp bài</span></>}
               </button>
            </div>
         </div>
      )}

      {/* FIXED SPELLING POPUP */}
      {activePopup && activePopup.rect && !isChecking && !feedbackData && (
         <div className="fixed bg-slate-900 text-white shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-3 text-[15px] animate-fade-in z-[99999] whitespace-nowrap pointer-events-none ring-1 ring-white/20 font-typewriter"
            style={{ 
                top: activePopup.rect.top, 
                left: activePopup.rect.left,
                transform: 'translate(-50%, calc(-100% - 10px))' 
            }}>
            {activePopup.expected.includes("Xóa") ? <span className="text-amber-400 font-bold">{activePopup.expected}</span> :
             activePopup.expected.includes("Sai") ? <span className="text-rose-400 font-bold">{activePopup.expected}</span> :
               <><span className="line-through text-slate-500 font-medium">{activePopup.typed}</span><ArrowRight size={14} className="text-indigo-400"/><span className="text-emerald-400 font-bold">{activePopup.expected}</span></>
            }
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 w-3 h-3 bg-slate-900 rotate-45 ring-r ring-b ring-white/20"></div>
         </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        .font-typewriter, textarea, input, .font-serif { 
            font-family: 'American Typewriter', 'Special Elite', 'Courier New', Courier, monospace !important; 
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

        body { background-color: #F1F5F9; }
      `}} />
    </div>
  );
}