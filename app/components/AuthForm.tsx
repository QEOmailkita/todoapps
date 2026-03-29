"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "確認メールを送りました。メールを確認してください！" });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: "メールアドレスまたはパスワードが違います" });
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] mb-2">タスク</h1>
          <p className="text-sm text-[#9a9a9a]">
            {mode === "login" ? "ログインしてタスクを管理" : "アカウントを作成"}
          </p>
        </div>

        {/* フォーム */}
        <div className="bg-white rounded-2xl border border-[#e8e8e0] p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#9a9a9a] mb-1.5">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e0] text-sm text-[#1a1a2e] placeholder-[#c0c0b8] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9a9a9a] mb-1.5">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="6文字以上"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e0] text-sm text-[#1a1a2e] placeholder-[#c0c0b8] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition-all"
            />
          </div>

          {/* メッセージ */}
          {message && (
            <div className={`text-xs px-3 py-2 rounded-lg ${
              message.type === "error"
                ? "bg-red-50 text-red-500"
                : "bg-green-50 text-green-600"
            }`}>
              {message.text}
            </div>
          )}

          {/* ボタン */}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full py-3 bg-[#1a1a2e] text-white rounded-xl text-sm font-medium hover:bg-[#2d2d44] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? "..." : mode === "login" ? "ログイン" : "アカウント作成"}
          </button>
        </div>

        {/* モード切り替え */}
        <p className="text-center text-xs text-[#9a9a9a] mt-6">
          {mode === "login" ? "アカウントをお持ちでない方は" : "すでにアカウントをお持ちの方は"}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }}
            className="ml-1 text-[#1a1a2e] font-medium underline underline-offset-2"
          >
            {mode === "login" ? "新規登録" : "ログイン"}
          </button>
        </p>
      </div>
    </div>
  );
}
