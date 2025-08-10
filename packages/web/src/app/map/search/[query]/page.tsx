import { Metadata } from "next";
import MapApp from "../../../MapApp";

interface SearchPageProps {
  params: Promise<{ query: string }>;
}

export async function generateMetadata({
  params,
}: SearchPageProps): Promise<Metadata> {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);
  
  return {
    title: `Search: ${decodedQuery} - otoge.app`,
    description: `Search results for "${decodedQuery}" - Find rhythm game arcades near you.`,
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { query } = await params;
  const searchQuery = decodeURIComponent(query);
  
  return <MapApp initialSearchQuery={searchQuery} />;
}