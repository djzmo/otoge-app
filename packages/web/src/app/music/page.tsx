import { Metadata } from "next";
import FilterSheet from "@/components/MusicFilter/FilterSheet";
import FilterSidebar from "@/components/MusicFilter/FilterSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Music",
  description: "Discover and explore rhythm game music",
};

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <div className="flex">
          <ErrorBoundary
            fallback={
              <div className="p-4">
                <p className="text-center text-gray-600">Filters unavailable</p>
              </div>
            }
          >
            <FilterSidebar />
            <FilterSheet open={true} />
          </ErrorBoundary>

          <main className="flex-1 p-4">
            <div className="max-w-5xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Music</h1>
              <p className="text-gray-600">Filter and explore songs.</p>
            </div>
          </main>
        </div>
      </div>
      <div className="h-[60px] md:hidden" />
    </div>
  );
}