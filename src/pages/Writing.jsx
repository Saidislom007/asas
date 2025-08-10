import { useState, useEffect } from "react";
import "./writing.css";

const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export default function Writing() {
  const [step, setStep] = useState(1);
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", last_name: "", middle_name: "", phone: "" });
  const [writingTest, setWritingTest] = useState(null);

  useEffect(() => {
    const fetchWritingTest = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/writing-tests/`);
        const data = await res.json();
        setWritingTest(data[0]);
      } catch (err) {
        console.error("Writing testni olishda xatolik:", err);
      }
    };

    fetchWritingTest();

    const saved = JSON.parse(localStorage.getItem("writing_essay"));
    const user = JSON.parse(localStorage.getItem("user"));
    if (saved) {
      setTask1(saved.task1 || "");
      setTask2(saved.task2 || "");
    }
    if (user) {
      setUserInfo(user);
    }
  }, []);

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = (text) => text.replace(/\s/g, "").length;

  const handleSave = () => {
    const submission = {
      task1,
      task2,
      wordCount1: wordCount(task1),
      wordCount2: wordCount(task2),
      submittedAt: new Date().toISOString(),
      userInfo,
    };

    localStorage.setItem("writing_essay", JSON.stringify(submission));
    const all = JSON.parse(localStorage.getItem("writing_essay_submissions")) || [];
    all.push(submission);
    localStorage.setItem("writing_essay_submissions", JSON.stringify(all));
  };

  const sendToTelegram = async (taskText, taskNum) => {
    const message = `
✍️ *IELTS Writing Task ${taskNum}*

👤 *Foydalanuvchi:* ${userInfo.name} ${userInfo.middle_name} ${userInfo.last_name}
📞 *Telefon:* ${userInfo.phone}
📅 *Sana:* ${new Date().toLocaleString()}

📝 *Yozuv:*
${taskText}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("Telegramga yuborishda xatolik:", err);
    }
  };

  const renderTask = (taskNum) => {
    if (!writingTest) return <p>⏳ Savollar yuklanmoqda...</p>;

    const taskData = taskNum === 1 ? writingTest.task1[0] : writingTest.task2[0];
    const prompt = taskData?.question_text || "";
    const image = taskData?.image || "";
    const value = taskNum === 1 ? task1 : task2;
    const setValue = taskNum === 1 ? setTask1 : setTask2;

    return (
      <div className={`writing-container ${darkMode ? "dark" : ""}`}>
        <div className="topbar">
          <h1>📝 IELTS Writing Task {taskNum}</h1>

        </div>

        <div className="prompt">
          {prompt}
          {taskNum === 1 && image && (
            <div>
              <img src={image} alt="Task 1 image" className="task-image" />
            </div>
          )}
        </div>

        <textarea
          className="writing-area"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write here..."
          rows={18}
        />

        <div className="meta">
          Word Count: <strong>{wordCount(value)}</strong> 
        </div>

        <div className="btns">
          {taskNum === 2 && (
            <button className="back-btn" onClick={() => setStep(1)}>
              ⬅️ Pervious
            </button>
          )}
          <button
            className="main-btn"
            onClick={async () => {
              handleSave();
              await sendToTelegram(value, taskNum);
              if (taskNum === 1) {
                setStep(2);
              } else {
                alert("✅ Both texts send to admin");
              }
            }}
          >
            {taskNum === 1 ? "Next ➡️" : "✅ Complete"}
          </button>
        </div>
      </div>
    );
  };

  return step === 1 ? renderTask(1) : renderTask(2);
}
