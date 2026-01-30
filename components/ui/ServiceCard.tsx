import Image from 'next/image';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export default function ServiceCard({ icon, title, description, className = '' }: ServiceCardProps) {
  return (
    <div className={`group relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-emerald-500/30 ${className}`}>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
          <Image src={icon} alt={title} width={28} height={28} className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
}
