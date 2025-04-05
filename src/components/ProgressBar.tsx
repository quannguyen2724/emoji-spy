import { motion } from 'framer-motion';

interface ProgressBarProps {
  timeLeft: number;
  totalTime: number;
}

export default function ProgressBar({ timeLeft, totalTime }: ProgressBarProps) {
  const progress = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= totalTime * 0.3;

  return (
    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
      <motion.div
        className={`h-full ${isLowTime ? 'bg-game-error' : 'bg-game-primary'}`}
        initial={{ width: '100%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
} 