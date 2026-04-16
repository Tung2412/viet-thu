const MODEL = "gemini-2.5-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

const buildPrompt = ({ input, targetEn, targetVn }) => `
Bạn là giáo viên chấm bài viết tiếng Anh cho học sinh Việt Nam.

Nhiệm vụ:
- Đánh giá câu học sinh có diễn đạt đúng ý tiếng Việt hay không.
- Không bắt buộc học sinh phải viết y hệt câu mẫu.
- Chấp nhận các cách diễn đạt khác nếu đúng nghĩa, tự nhiên và ngữ pháp đủ tốt để giao tiếp/học tập.
- Từ chối nếu sai ý chính, thiếu ý quan trọng, ngữ pháp quá sai làm đổi nghĩa, hoặc dùng từ sai nghiêm trọng.
- Nếu chỉ khác cách diễn đạt nhưng vẫn đúng ý, hãy chấp nhận.
- Nếu không chấp nhận, chỉ liệt kê những từ/cụm từ sai nổi bật vào errorWords.

Đầu vào:
- Ý tiếng Việt: "${targetVn}"
- Câu mẫu tham khảo: "${targetEn}"
- Câu học sinh: "${input}"

Chỉ trả về JSON hợp lệ theo đúng schema này:
{
  "isAccepted": true,
  "explanation": "string",
  "suggestion": "string",
  "errorWords": ["string"]
}
`;

const parseGeminiJson = (data) => {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini không trả về nội dung hợp lệ.");
  }

  const parsed = JSON.parse(text);
  return {
    isAccepted: Boolean(parsed?.isAccepted),
    explanation: parsed?.explanation || "Đã chấm xong.",
    suggestion: parsed?.suggestion || "",
    errorWords: Array.isArray(parsed?.errorWords) ? parsed.errorWords : [],
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const OVERLOADED_MESSAGE =
  "Hệ thống chấm điểm đang có nhiều người sử dụng. Bạn đợi 5 giây rồi bấm Nộp lại nhé!";

const callGemini = async (apiKey, prompt) => {
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 2000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    const data = await response.json();

    const errMsg = (data?.error?.message || "").toLowerCase();
    const isOverloaded =
      response.status === 503 ||
      errMsg.includes("high demand") ||
      errMsg.includes("overloaded");

    if (isOverloaded && attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY);
      continue;
    }

    if (!response.ok) {
      throw new Error(isOverloaded ? OVERLOADED_MESSAGE : data?.error?.message || "Gemini API đang báo lỗi.");
    }

    return data;
  }
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders };
  }

  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Only POST is allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return createResponse(500, {
      error: "Bạn chưa thêm GEMINI_API_KEY trong Netlify.",
    });
  }

  try {
    const { input, targetEn, targetVn } = JSON.parse(event.body || "{}");
    if (!input || !targetEn || !targetVn) {
      return createResponse(400, {
        error: "Thiếu input, targetEn hoặc targetVn.",
      });
    }

    const data = await callGemini(apiKey, buildPrompt({ input, targetEn, targetVn }));
    return createResponse(200, parseGeminiJson(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi chấm bài.";
    const isOverloaded = message === OVERLOADED_MESSAGE;
    return createResponse(isOverloaded ? 503 : 500, { error: message });
  }
}
