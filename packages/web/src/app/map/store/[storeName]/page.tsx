import { Metadata } from "next";
import MapApp from "../../../MapApp";

interface StorePageProps {
  params: Promise<{ storeName: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { storeName } = await params;
  const decoded = decodeURIComponent(storeName);
  return {
    title: `${decoded} - otoge.app`,
    description: `Store details and games for ${decoded}`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeName } = await params;
  const searchQuery = decodeURIComponent(storeName);
  return <MapApp initialSearchQuery={searchQuery} />;
} 