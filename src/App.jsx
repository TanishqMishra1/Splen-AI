import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

export default function App() {
  const [time, setTime] = useState(new Date());
  const [command, setCommand] = useState("");
  const [feed, setFeed] = useState(["SPLEN online"]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const execute = async () => {
    if (!command.trim()) return;

    const userPrompt = command;

    setCommand("");

    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are SPLEN AI. Generate a project summary, recommended tech stack, estimated time, and development plan.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const aiResponse =
        completion.choices[0].message.content;

      setFeed((prev) => [aiResponse, ...prev]);
    } catch (error) {
      console.error(error);

      setFeed((prev) => [
        "NEXUS AI unavailable",
        ...prev,
      ]);
    }
  };



  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,.4) 1px, transparent 1px),linear-gradient(90deg, rgba(34,211,238,.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center border border-cyan-500/15 bg-[#07111f]/80 rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Brain className="text-cyan-400" />
            <div>
              <h1 className="text-3xl tracking-[0.35em] font-light text-cyan-200">SPLEN OS</h1>
              <p className="text-xs tracking-[0.35em] text-cyan-500 mt-1">PERSONAL COMMAND CENTER</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-[0.25em] text-cyan-300">ONLINE</span>
          </div>
        </div>

        <div className="text-center py-10">
          <h2 className="text-6xl md:text-8xl font-light tracking-[0.1em] text-cyan-100 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
            {time.toLocaleTimeString()}
          </h2>
          <p className="text-cyan-100/60 mt-4">{time.toDateString()}</p>
        </div>

        <div className="flex justify-center mt-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="relative h-44 w-44 rounded-full border border-cyan-400/20 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.2)]"
          >
            <div className="absolute inset-3 rounded-full border border-cyan-400/10" />
            <div className="absolute inset-7 rounded-full border border-cyan-400/10" />
            <Brain size={42} className="text-cyan-300" />
            <motion.div
              animate={{ y: [-70, 70, -70] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-full h-[2px] bg-cyan-400"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {["Projects:24", "Tasks:128", "Notes:57"].map((s) => (
            <div key={s} className="rounded-3xl border border-cyan-500/15 bg-[#07111f] p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)] hover:shadow-[0_0_50px_rgba(34,211,238,0.15)] transition-all">
              <div className="text-3xl font-light">{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-cyan-500/15 bg-[#07111f] p-6 backdrop-blur-xl">
          <div className="flex gap-3">
            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-[#01060c] rounded-xl p-4 outline-none shadow-[inset_0_0_30px_rgba(34,211,238,0.05)]"
              placeholder="What do you want to do?"
            />
            <button onClick={execute} className="px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center gap-2">
              <Send size={16} /> Execute
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-cyan-500/15 bg-[#07111f] p-6">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl tracking-[0.25em] uppercase text-cyan-300">
              Activity Feed
            </h3>

            <span className="text-xs text-cyan-500 tracking-widest">
              LIVE SYSTEM OUTPUT
            </span>
          </div>

          <AnimatePresence>
            {feed.map((item, i) => {

              const content = typeof item === "string"
                ? item
                : item.content;

              return (
                <motion.div
                  key={item + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-[#07111f] border border-cyan-500/10 rounded-xl p-4 mb-3 overflow-hidden"
                >

                  {/* Left Accent Line */}
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-cyan-400" />

                  {/* Timestamp / Status */}
                  <div className="flex items-center gap-2 mb-2 pl-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] tracking-widest text-cyan-500 uppercase">
                      System Response
                    </span>
                  </div>

                  {/* AI Response */}
                  <div className="pl-3 text-sm leading-7 text-cyan-100">

                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-semibold text-cyan-300 mb-4">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-cyan-300 mb-3 mt-4">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-lg text-cyan-200 mb-2 mt-3">
                            {children}
                          </h3>
                        ),

                        p: ({ children }) => (
                          <p className="mb-3 text-cyan-100/90">
                            {children}
                          </p>
                        ),

                        strong: ({ children }) => (
                          <strong className="text-cyan-300 font-semibold">
                            {children}
                          </strong>
                        ),

                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 mb-3">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-3">
                            {children}
                          </ol>
                        ),

                        code: ({ inline, children }) =>
                          inline ? (
                            <code className="bg-cyan-950/50 text-cyan-300 px-1.5 py-0.5 rounded">
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-[#01060c] border border-cyan-500/20 rounded-xl p-4 overflow-x-auto my-4">
                              <code className="text-green-300 text-xs">
                                {children}
                              </code>
                            </pre>
                          ),
                      }}
                    >
                      {content}
                    </ReactMarkdown>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
