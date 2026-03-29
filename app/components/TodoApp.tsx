"use client";

import { useState, useEffect } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch {
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const total = todos.length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] mb-1">
            タスク
          </h1>
          {total > 0 && (
            <p className="text-sm text-[#9a9a9a]">
              {remaining === 0
                ? "すべて完了しました"
                : `残り ${remaining} / ${total} 件`}
            </p>
          )}
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#e8e8e0] bg-white text-[#1a1a2e] placeholder-[#c0c0b8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition-all"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="px-5 py-3 bg-[#1a1a2e] text-white rounded-xl text-sm font-medium hover:bg-[#2d2d44] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            追加
          </button>
        </div>

        {/* タスクリスト */}
        {todos.length === 0 ? (
          <div className="text-center py-16 text-[#c0c0b8]">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-sm">タスクはありません</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                  todo.completed
                    ? "bg-[#f0efec] border-transparent"
                    : "bg-white border-[#e8e8e0] hover:border-[#d0d0c8] hover:shadow-sm"
                }`}
              >
                {/* チェックボックス */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    todo.completed
                      ? "bg-[#1a1a2e] border-[#1a1a2e]"
                      : "border-[#d0d0c8] hover:border-[#1a1a2e]"
                  }`}
                >
                  {todo.completed && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 6l3 3 5-5"
                      />
                    </svg>
                  )}
                </button>

                {/* テキスト */}
                <span
                  className={`flex-1 text-sm leading-relaxed transition-all ${
                    todo.completed
                      ? "line-through text-[#b0b0a8]"
                      : "text-[#1a1a2e]"
                  }`}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="削除"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-[#c0c0b8] hover:text-[#e05555] hover:bg-[#ffe8e8] transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 完了タスクをまとめて削除 */}
        {todos.some((t) => t.completed) && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
              className="text-xs text-[#b0b0a8] hover:text-[#e05555] transition-colors"
            >
              完了済みを削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
