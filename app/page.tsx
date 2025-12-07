import DonationCard from "@/components/DonationCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-4">
      <main className="w-full">
        <DonationCard />
      </main>
    </div>
  );
}
