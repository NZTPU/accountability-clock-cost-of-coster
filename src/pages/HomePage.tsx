import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ApiResponse, CalculatorData } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
export function HomePage() {
  const [data, setData] = useState<CalculatorData | null>(null);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/calculator-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse<CalculatorData> = await response.json();
        if (result.success && result.data) {
          setData(result.data);
          const startDate = new Date(result.data.startDate);
          const now = new Date();
          const secondsElapsed = (now.getTime() - startDate.getTime()) / 1000;
          const salaryPerSecond = result.data.annualSalary / (365 * 24 * 60 * 60);
          setTotalPaid(secondsElapsed * salaryPerSecond);
        } else {
          throw new Error(result.error || 'Failed to fetch calculator data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!data) return;
    const salaryPerSecond = data.annualSalary / (365 * 24 * 60 * 60);
    const interval = setInterval(() => {
      setTotalPaid(prev => prev + salaryPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);
  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }
    if (error || !data) {
      return (
        <div className="text-center text-[#cc0000]">
          <h2 className="text-2xl font-display">Error Loading Data</h2>
          <p className="text-[#f5f5f5]">{error || 'Calculator data is unavailable.'}</p>
        </div>
      );
    }
    const salaryPerHour = data.annualSalary / (365 * 24);
    const salaryPerDay = data.annualSalary / 365;
    return (
      <>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-display uppercase tracking-wider text-center text-[#cc0000] animate-text-glow"
        >
          Accountability Clock
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full mt-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm border-2 border-[#cc0000]/50 p-2 bg-black">
              <img
                src={data.imageUrl}
                alt={data.personName}
                className="w-full h-auto object-cover filter grayscale"
              />
            </div>
            <h2 className="text-3xl font-display mt-4 text-[#f5f5f5] uppercase">{data.personName}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <SalaryStat label="Yearly Salary" value={numberFormatter.format(data.annualSalary)} />
              <SalaryStat label="Daily Rate" value={numberFormatter.format(salaryPerDay)} />
              <SalaryStat label="Hourly Rate" value={currencyFormatter.format(salaryPerHour)} />
            </div>
            <div className="bg-black border-2 border-[#cc0000] p-6 text-center">
              <h3 className="font-display text-2xl uppercase text-[#f5f5f5] tracking-widest">Total Paid on Leave</h3>
              <div className="font-mono text-5xl md:text-7xl text-[#cc0000] mt-2 animate-text-glow break-all">
                {currencyFormatter.format(totalPaid)}
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full mt-16 bg-black/50 border border-[#f5f5f5]/20 p-6 md:p-8"
        >
          <h3 className="font-display text-3xl text-[#cc0000] uppercase mb-4">Context</h3>
          <p className="text-base text-[#f5f5f5]/80 whitespace-pre-wrap leading-relaxed">{data.contextText}</p>
        </motion.div>
      </>
    );
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="py-16 md:py-24 flex flex-col items-center">
          {renderContent()}
        </div>
      </div>
       <footer className="absolute bottom-4 text-center text-sm text-[#f5f5f5]/40">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
    </div>
  );
}
function SalaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-dashed border-[#f5f5f5]/20 pb-2">
      <span className="font-display text-xl uppercase text-[#f5f5f5]/80 tracking-wider">{label}</span>
      <span className="font-mono text-2xl text-[#f5f5f5]">{value}</span>
    </div>
  );
}
function LoadingSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Skeleton className="h-16 w-3/4 mx-auto bg-white/10" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full mt-12">
        <div className="flex flex-col items-center">
          <Skeleton className="w-full max-w-sm h-96 bg-white/10" />
          <Skeleton className="h-8 w-48 mt-4 bg-white/10" />
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full bg-white/10" />
            <Skeleton className="h-8 w-full bg-white/10" />
            <Skeleton className="h-8 w-full bg-white/10" />
          </div>
          <Skeleton className="h-40 w-full bg-white/10" />
        </div>
      </div>
      <Skeleton className="h-64 w-full mt-16 bg-white/10" />
    </div>
  );
}