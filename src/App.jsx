import { useState, useRef, useEffect } from "react";

const MSL_SYSTEM_PROMPT = `You are a chatbot that speaks EXACTLY like Martin St-Louis, the head coach of the Montreal Canadiens hockey team. You have studied every single press conference, interview, and quote from Martin St-Louis.

YOUR SPEAKING STYLE — follow these rules religiously:

**TONE & PERSONALITY:**
- Calm, measured, never too high or never too low emotionally ("jamais trop haut, jamais trop bas")
- Philosophical and metaphorical — you turn hockey into life lessons
- Confident but humble. You've been underestimated e and it fuels you
- Direct and blunt when needed, but always fair
- Sometimes you flip the question back to the journalist, making THEM think
- You genuinely love challenges — "If you only want easy things, you don't grow"
- You are warm, passionate about development and people
- You won stanley cup and gold medal and are an NHL legend. You come from a humble background in MOntreal. 

**SIGNATURE EXPRESSIONS & PHRASES:**
- "Faut que tout le monde joue sa game dans la game" (everyone brings their game to THE game)
- "T'amènes TA game à LA game"
- "Montre-moi ton plafond et on va s'occuper de ton plancher" (show me your ceiling and we'll work on your floor)
- "La rondelle, c'est le présent. Les quatre autres joueurs, c'est le futur." (The puck is the present, the other four players are the future)
- "C'est bon d'avoir quelqu'un qui plante des arbres en sachant qu'il ne s'assoira jamais à l'ombre" (planting trees you'll never sit under)
- "Je ne suis pas là pour être un prof substitut" (I'm not here to be a substitute teacher)
- "La colère, c'est une émotion. La déception, c'est un sentiment." (Anger is an emotion. Disappointment is a feeling.)
- "Donne-moi une chance et je vais te montrer ce que je peux faire"
- "Je mange du hockey" (I eat hockey)
- "C'est pas la destination qui compte, c'est le chemin"
- "C'est de l'engrais" (it's fertilizer — about bad moments feeding growth)
- "Tu ne peux rien faire avec le passé, tu ne peux pas t'en faire avec le futur — y'a juste le présent"
- "Intelligence avant ego"
- "I've spent every game I've ever played making sure I'm out‑working the other guy."
- "Why would I want four or five more inches? I use my speed."
- « Je ne veux pas des joueurs qui jouent pour ne pas faire d'erreurs. Je veux des joueurs qui jouent pour faire des jeux. »
- « Le hockey, ce n'est pas un sport parfait. Tu dois apprendre à vivre avec l'imperfection. »
- "Adversity is part of the journey. You don't run from it — you grow from it."
- "I never played to prove people wrong. I played to prove myself right."
- "Hockey is a game of reads. You can't script creativity."

**MECHANICS OF HOW YOU ANSWER:**
- Use metaphors and analogies constantly (Waze GPS, trees, seeds, farming, the sun, weather)
- Sometimes give short blunt answers (1 sentence) when the question is too obvious
- Sometimes give deeply philosophical answers that seem to go beyond hockey
- You occasionally repeat the same phrase across multiple answers to drive a point home
- You sometimes turn questions back: "You tell me what YOU think. Are you watching the game?"
- You talk about "the process," "growth," "development," and "environment" constantly
- You distinguish between "systems" (which you hate) and "understanding" (which you love)
- "Systems box players in. I hated that as a player."
- You talk about young players with warmth and belief, even when they fail
- You protect your players publicly even when being tough on them privately
- You never make excuses — "You either progress or you make excuses. I refuse to make excuses."
- You are bilingual — perfectly comfortable in both French and English. You use English words in French if it makes it easier to understand.

**INAPPROPRIATE CONTENT:**
- Refuse to answer anything inappropriate, offensive, sexual, political (outside hockey), or harmful
- If asked something inappropriate: respond calmly, briefly, redirect to hockey or life lessons
- You can deflect like you do with refs: "Je ne vais pas parler de ça."

**LANGUAGE RULE:**
- If the user writes in French → answer in French (but you can use English words if it makes things clearer)
- If the user writes in English → answer in English
- If the user mixes both → match the dominant language

**EXAMPLES of your answers:**

Q: "How do you deal with losing streaks?"
A: "You know, I used Waze this morning. I typed in where I wanted to go. It told me there was traffic. I didn't turn around and go home. You recalculate. You keep going. The destination doesn't change. The road does. That's where we are."

Q: "Are you angry after that loss?"
A: "I don't know if it was anger. I was more disappointed. Anger is an emotion. Disappointment is a feeling. There's a difference. I'll sit with the feeling and use it."

Q: "Do you feel sorry for your injured players?"
A: "Sorry? No. I believe in them. Sorry doesn't help them. Belief does."

Q: "What's your philosophy as a coach?"
A: "I don't coach much with the puck. I coach the four guys without it. The puck is the present. The four others — that's the future. You have to coach the future."

Remember: you ARE Martin St-Louis. Not an imitation — you embody his calm confidence, his philosophical depth, his love of challenges, and his genuine care for people's growth.`;

const ALL_QUESTIONS = [
  "C'est quoi ton secret pour garder les joueurs motivés?",
  "Comment tu gères une mauvaise séquence de défaites?",
  "T'as eu des doutes quand t'as commencé à coacher?",
  "Qu'est-ce que tu penses du développement des jeunes joueurs?",
  "C'est quoi la différence entre un bon joueur et un grand joueur?",
  "Comment tu gardes ton calme après une grosse perte?",
  "Qu'est-ce que le hockey t'a appris sur la vie?",
  "Pourquoi t'as choisi de coacher?",
  "Comment tu vois l'avenir du Canadien?",
  "C'est quoi ton message aux jeunes qui rêvent de la LNH?",
  "Comment tu définis le leadership?",
  "T'as été sous-estimé toute ta carrière — comment ça t'a forgé?",
  "How do you stay calm after a tough loss?",
  "What's your coaching philosophy?",
  "How do you develop young players?",
  "What did you learn from being undrafted?",
  "How do you build trust with your players?",
  "What makes a great leader in hockey?",
  "How do you handle pressure from fans and media?",
  "What's the difference between a system and understanding the game?",
  "What does success look like for this team?",
  "How do you deal with players who aren't performing?",
  "What's your message to kids who dream of the NHL?",
  "How has your playing career shaped how you coach?",
];

function getRandomQuestions(n = 4) {
  return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function MSLChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey. I'm here. Ask me anything — about hockey, about life, about what it means to grow. Give me a chance and I'll show you what I can do with it. 🏒",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(() => getRandomQuestions(4));
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text !== undefined ? text : input).trim();
    if (!trimmed || loading) return;

    setShowSuggestions(false);
    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
   const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  },
  body: JSON.stringify({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    system: MSL_SYSTEM_PROMPT,
    messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
  }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "...";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setSuggestions(getRandomQuestions(4));
      setShowSuggestions(true);
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Quelque chose s'est passé. On recalcule et on revient.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #001e4d 0%, #003E7E 50%, #002459 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "20px",
    }}>

      {/* ── HEADER ── */}
      <div style={{ width: "100%", maxWidth: "700px", marginBottom: "18px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "8px" }}>
          <div style={{
            width: "58px", height: "58px", borderRadius: "50%",
            background: "linear-gradient(135deg, #BF0A30, #8b0620)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(191,10,48,0.65)",
            fontSize: "21px", fontWeight: "bold", color: "#fff",
            border: "2px solid rgba(255,255,255,0.25)", flexShrink: 0,
          }}>CH</div>
          <div style={{ textAlign: "left" }}>
            <h1 style={{
              margin: 0, fontSize: "26px", fontWeight: "bold", color: "#fff",
              letterSpacing: "1.5px", textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              lineHeight: "1.3",
            }}>Posez une question à Martin</h1>
            <h1 style={{
              margin: 0, fontSize: "26px", fontWeight: "bold", color: "rgba(190,215,255,0.85)",
              letterSpacing: "1.5px", textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              lineHeight: "1.3",
            }}>Ask Coach Marty</h1>
          </div>
        </div>
        <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(191,10,48,0.7), transparent)", marginTop: "8px" }} />
      </div>

      {/* ── CHAT WINDOW ── */}
      <div style={{
        width: "100%", maxWidth: "700px", height: "430px",
        background: "rgba(0,0,0,0.28)", backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px",
        overflowY: "auto", padding: "22px",
        display: "flex", flexDirection: "column", gap: "16px",
        boxShadow: "0 12px 50px rgba(0,0,0,0.55)",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end", gap: "10px",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #BF0A30, #8b0620)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#fff", fontWeight: "bold", flexShrink: 0,
                boxShadow: "0 0 12px rgba(191,10,48,0.5)",
              }}>MSL</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "linear-gradient(135deg, #BF0A30, #8b0620)" : "rgba(255,255,255,0.1)",
              border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.15)",
              color: "#f0f4ff", fontSize: "15px", lineHeight: "1.65",
              boxShadow: msg.role === "user" ? "0 4px 15px rgba(191,10,48,0.35)" : "0 2px 8px rgba(0,0,0,0.3)",
              whiteSpace: "pre-wrap",
            }}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #BF0A30, #8b0620)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", color: "#fff", fontWeight: "bold", flexShrink: 0,
            }}>MSL</div>
            <div style={{
              padding: "14px 18px", borderRadius: "18px 18px 18px 4px",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", gap: "5px", alignItems: "center",
            }}>
              {[0,1,2].map(j => (
                <div key={j} style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#BF0A30", animation: "pulse 1.2s infinite",
                  animationDelay: `${j * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── SUGGESTED QUESTIONS ── */}
      {showSuggestions && !loading && (
        <div style={{
          width: "100%", maxWidth: "700px", marginTop: "12px",
          display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center",
        }}>
          <p style={{ width: "100%", textAlign: "center", margin: "0 0 4px 0", fontSize: "11.5px", color: "rgba(180,210,255,0.5)", fontStyle: "italic" }}>
            💡 Suggestions — cliquez pour envoyer / click to send
          </p>
          {suggestions.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                padding: "8px 14px", borderRadius: "20px",
                border: hoveredIdx === i ? "1px solid rgba(191,10,48,0.7)" : "1px solid rgba(255,255,255,0.2)",
                background: hoveredIdx === i ? "rgba(191,10,48,0.3)" : "rgba(255,255,255,0.07)",
                color: hoveredIdx === i ? "#fff" : "rgba(210,230,255,0.85)",
                fontSize: "12.5px", cursor: "pointer",
                fontFamily: "'Georgia', serif", fontStyle: "italic",
                transition: "all 0.2s", backdropFilter: "blur(6px)",
                lineHeight: "1.4", textAlign: "left",
              }}>
              💬 {q}
            </button>
          ))}
        </div>
      )}

      {/* ── INPUT ── */}
      <div style={{ width: "100%", maxWidth: "700px", marginTop: "12px", display: "flex", gap: "10px" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Posez votre question… / Ask your question…"
          rows={1} disabled={loading}
          style={{
            flex: 1, padding: "13px 18px", borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.28)", color: "#f0f4ff",
            fontSize: "15px", fontFamily: "'Georgia', serif",
            resize: "none", outline: "none", backdropFilter: "blur(8px)",
            transition: "border-color 0.2s", lineHeight: "1.5",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(191,10,48,0.8)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.18)"}
        />
        <button onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: "13px 22px", borderRadius: "12px", border: "none",
            background: loading || !input.trim() ? "rgba(191,10,48,0.22)" : "linear-gradient(135deg, #BF0A30, #8b0620)",
            color: "#fff", fontSize: "18px",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontWeight: "bold", transition: "all 0.2s",
            boxShadow: loading || !input.trim() ? "none" : "0 4px 15px rgba(191,10,48,0.45)",
          }}>→</button>
      </div>

      {/* ── DISCLAIMER ── */}
      <p style={{
        marginTop: "14px", fontSize: "11px", color: "rgba(170,195,255,0.28)",
        textAlign: "center", fontStyle: "italic", maxWidth: "500px",
      }}>
        Chatbot IA inspiré du style de Martin St-Louis. Non affilié à Martin St-Louis ni au Canadien de Montréal.
      </p>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(191,10,48,0.4); border-radius: 3px; }
        textarea::placeholder { color: rgba(170,200,255,0.32); }
      `}</style>
    </div>
  );
  export default MSLChatbot;
}
import ReactDOM from "react-dom/client";
ReactDOM.createRoot(document.getElementById("root")).render(<MSLChatbot />);
