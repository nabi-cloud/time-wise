import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Hello</h1>
    </div>
  );
}
