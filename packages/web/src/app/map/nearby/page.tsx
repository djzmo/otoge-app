import { Metadata } from "next";
import MapApp from "../../MapApp";

export const metadata: Metadata = {
  title: "Nearby - otoge.app",
  description: "Find nearby rhythm game arcades around your current location.",
};

export default function NearbyPage() {
  return <MapApp initialSearchQuery="" />;
} 