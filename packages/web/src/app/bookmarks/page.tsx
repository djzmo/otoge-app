import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your saved arcade locations and favorites",
};

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bookmarks</h1>
        <p className="text-gray-600">Bookmarks page coming soon...</p>
      </div>
      <div className="h-[60px] md:hidden" />
    </div>
  );
}