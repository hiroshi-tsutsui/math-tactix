import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "戻る" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Link>
  );
}
