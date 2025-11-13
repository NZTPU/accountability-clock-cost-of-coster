import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { intervalToDuration } from 'date-fns';
import type { ApiResponse, CalculatorData } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
const totalPaidFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});
// Updated mailto link as per client request
const mailtoLink = `mailto:commission@publicservice.govt.nz?cc=submissions@taxpayers.org.nz&subject=Sack%20Andrew%20Coster%2C%20No%20Golden%20Goodbye.&body=Dear%20Mr%20Roche%2C%0A%0AI%E2%80%99m%20writing%20to%20urge%20you%20to%20immediately%20dismiss%20Andrew%20Coster%20from%20his%20role%20as%20Chief%20Executive%20of%20the%20Social%20Investment%20Agency.%0A%0AThe%20Independent%20Police%20Conduct%20Authority%E2%80%99s%20findings%20of%20%E2%80%9Cserious%20misconduct%E2%80%9D%20and%20%E2%80%9Ca%20total%20lack%20of%20leadership%20and%20integrity%E2%80%9D%20make%20his%20continued%20employment%20untenable.%0AIt%20is%20unacceptable%20that%20he%20remains%20on%20full%20paid%20leave%20at%20taxpayers%E2%80%99%20expense%2C%20and%20equally%20unacceptable%20that%20any%20golden%20handshake%20be%20considered.%0A%0ATaxpayers%20deserve%20real%20accountability.%20That%20means%20consequences%2C%20not%20a%20payout.%0A%0ASincerely%2C`;
export function HomePage() {
  const [data, setData] = useState<CalculatorData | null>(null);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>('');
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
    const startDate = new Date(data.startDate);
    const salaryPerSecond = data.annualSalary / (365 * 24 * 60 * 60);
    let animationFrameId: number;
    const updateTotal = () => {
      const now = new Date();
      const secondsElapsed = (now.getTime() - startDate.getTime()) / 1000;
      setTotalPaid(secondsElapsed * salaryPerSecond);
      animationFrameId = requestAnimationFrame(updateTotal);
    };
    animationFrameId = requestAnimationFrame(updateTotal);
    const updateElapsedTime = () => {
      const now = new Date();
      const duration = intervalToDuration({ start: startDate, end: now });
      const parts = [];
      if (duration.days) parts.push(`${duration.days}d`);
      if (duration.hours) parts.push(`${duration.hours}h`);
      if (duration.minutes) parts.push(`${duration.minutes}m`);
      if (duration.seconds) parts.push(`${duration.seconds}s`);
      setElapsedTime(parts.join(' '));
    };
    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
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
    const salaryPerDay = data.annualSalary / 365;
    const salaryPerFortnight = salaryPerDay * 14;
    return (
      <>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-display uppercase tracking-wider text-center text-[#cc0000] animate-text-glow"
        >
          Costly Coster Calculator
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full mt-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm border-2 border-[#cc0000]/50 p-2 bg-black animate-image-glitch">
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
              <SalaryStat label="Yearly Salary*" value={numberFormatter.format(data.annualSalary)} anchor="#salary-calculation" />
              <SalaryStat label="Fortnightly Rate" value={numberFormatter.format(salaryPerFortnight)} />
              <SalaryStat label="Daily Rate" value={numberFormatter.format(salaryPerDay)} />
            </div>
            <div className="bg-black border-2 border-[#cc0000] p-6 text-center">
              <h3 className="font-display text-2xl uppercase text-[#f5f5f5] tracking-widest">Paid Leave: Cost to Taxpayer</h3>
              <div className="font-mono text-4xl sm:text-5xl md:text-5xl lg:text-6xl text-[#cc0000] mt-2 animate-text-glow">
                {totalPaidFormatter.format(totalPaid)}
              </div>
              <p className="text-sm text-[#f5f5f5]/70 mt-2 font-mono">
                Time on garden leave: {elapsedTime}
              </p>
            </div>
            <Button asChild className="w-full bg-[#cc0000] text-white font-display text-xl tracking-wider py-6 hover:bg-[#a30000] transition-all duration-300 animate-button-glow hover:scale-105 hover:translate-y-[-4px]">
              <a href={mailtoLink}>
                EMAIL THE COMMISSIONER NOW
              </a>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full mt-16 bg-black/50 border border-[#f5f5f5]/20 p-6 md:p-8"
        >
          <h3 className="font-display text-3xl text-[#cc0000] uppercase mb-4 text-center">Context</h3>
          <p className="text-xl md:text-2xl text-center text-[#f5f5f5] leading-relaxed max-w-3xl mx-auto">{data.contextText}</p>
        </motion.div>
        <motion.div
          id="salary-calculation"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="w-full mt-16 bg-black/50 border border-[#f5f5f5]/20 p-6 md:p-8"
        >
          <h4 className="font-display text-3xl text-[#cc0000] uppercase mb-4 text-center">Salary Calculation</h4>
          <p className="text-lg text-center text-[#f5f5f5]/60 max-w-2xl mx-auto">
            The yearly salary is calculated based on the Chief Executive of the Social Investment Agency’s salary between November 11 and December 31 2024. This is then used to determine the cost to taxpayers in real time.
          </p>
          <p className="text-lg text-center text-[#f5f5f5]/60 max-w-3xl mx-auto mt-4 break-words">
            This figure is available at <a href="https://www.publicservice.govt.nz/system/leaders/appointing-leaders/leader-pay/chief-executive-remuneration" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#cc0000] transition-colors">www.publicservice.govt.nz/system/leaders/appointing-leaders/leader-pay/chief-executive-remuneration</a>
          </p>
        </motion.div>
      </>
    );
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between relative overflow-hidden">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="py-16 md:py-24 flex flex-col items-center">
          {renderContent()}
        </div>
      </main>
      <footer className="w-full py-6 bg-black border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
          <a
            href="https://www.taxpayers.org.nz/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <img
              src="https://assets.nationbuilder.com/themes/539f560501925b5591000001/attachments/original/1669929583/image-logo-white.png?1669929583"
              alt="New Zealand Taxpayer's Union Logo"
              className="h-24"
            />
          </a>
          <p className="text-sm text-center text-[#f5f5f5]/60">
            Promoted by the New Zealand Taxpayers' Union, 117 Lambton Quay, Wellington 6011
          </p>
        </div>
      </footer>
    </div>
  );
}
function SalaryStat({ label, value, anchor }: { label: string; value: string; anchor?: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-dashed border-[#f5f5f5]/20 pb-2">
      <span className="font-display text-xl uppercase text-[#f5f5f5]/80 tracking-wider">
        {anchor ? <a href={anchor} className="hover:text-[#cc0000] transition-colors">{label}</a> : label}
      </span>
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