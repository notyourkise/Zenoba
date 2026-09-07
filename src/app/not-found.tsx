import { LottiePlayer } from "@/components/effects/lottie-player";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen bg-white flex items-center justify-center p-2 sm:p-6 md:p-8 overflow-hidden select-none">
      <main className="w-full max-w-[1400px] flex items-center justify-center">
        <LottiePlayer
          src="/GIF/Page%20Not%20Found%20404.json"
          ariaLabel="404 Page Not Found"
          className="w-full h-auto aspect-[3/2] max-h-[94vh]"
        />
      </main>
    </div>
  );
}
