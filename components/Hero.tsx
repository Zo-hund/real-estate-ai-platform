import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative h-[600px] flex items-center justify-center text-white">
      <Image
        src="/hero-image.jpg"
        alt="Modern home exterior"
        fill
        className="object-cover brightness-50"
      />
      <div className="relative z-10 text-center space-y-4 max-w-3xl px-4">
        <h1 className="text-5xl font-bold">Find Your Dream Home with AI</h1>
        <p className="text-xl">
          Our AI-powered platform helps you discover the perfect property
          tailored to your preferences and needs.
        </p>
        <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
          Start Your Search
        </button>
      </div>
    </div>
  );
}
