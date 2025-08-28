import PageTitle from "../components/layout/PageTitle";

export default function User() {
  return (
    <div className="h-[calc(100vh-72px)] overflow-y-auto flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex items-center justify-between border-b-2 border-gray-300">
        <PageTitle />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center">
        صفحه یوزر
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
