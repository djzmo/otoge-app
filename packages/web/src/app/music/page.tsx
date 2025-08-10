import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description: "Discover and explore rhythm game music",
};

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Music</h1>
        <p className="text-gray-600">Music page coming soon...</p>
      </div>
      <div className="h-[60px] md:hidden" />
    </div>
  );
}