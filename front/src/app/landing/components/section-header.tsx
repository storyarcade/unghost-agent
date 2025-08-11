// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

export function SectionHeader({
  anchor,
  title,
  description,
}: {
  anchor?: string;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <>
      {anchor && <a id={anchor} className="absolute -top-20" />}
      <div className="mb-12 flex flex-col items-center justify-center gap-4">
        <h2 className="mb-4 bg-gradient-to-r from-slate-100 via-indigo-400 to-slate-100 bg-clip-text text-center text-5xl font-bold text-transparent">
          {title}
        </h2>
        <p className="text-slate-200 text-center text-xl font-medium max-w-3xl">
          {description}
        </p>
      </div>
    </>
  );
}
