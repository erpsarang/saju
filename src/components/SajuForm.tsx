import { useForm } from 'react-hook-form';
import { Sparkles, User, Calendar, Clock, MessageSquare } from 'lucide-react';
import type { SajuInput } from '../types/saju.types';
import { BIRTH_HOURS } from '../types/saju.types';

interface SajuFormProps {
  onSubmit: (data: SajuInput) => void;
}

export default function SajuForm({ onSubmit }: SajuFormProps) {
  const { register, handleSubmit, watch } = useForm<SajuInput>({
    defaultValues: {
      name: '',
      gender: 'male',
      birthDate: '',
      birthHour: '모름',
      isLunar: false,
      concern: '',
    },
  });

  const concern = watch('concern') || '';

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">사주 정보 입력</h2>
        <p className="text-gray-400 text-sm">생년월일시 정보를 입력하면 운세를 분석합니다.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <User className="w-4 h-4" /> 이름 (선택)
          </label>
          <input
            {...register('name')}
            placeholder="익명"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-gray-300 text-sm mb-2 block">성별</label>
          <div className="flex gap-3">
            <label className="flex-1">
              <input {...register('gender')} type="radio" value="male" className="sr-only peer" />
              <div className="py-3 rounded-lg border border-white/10 bg-white/5 text-center text-gray-300 cursor-pointer peer-checked:border-gold-500 peer-checked:bg-gold-500/10 peer-checked:text-gold-400 transition-all">
                남 ♂
              </div>
            </label>
            <label className="flex-1">
              <input {...register('gender')} type="radio" value="female" className="sr-only peer" />
              <div className="py-3 rounded-lg border border-white/10 bg-white/5 text-center text-gray-300 cursor-pointer peer-checked:border-gold-500 peer-checked:bg-gold-500/10 peer-checked:text-gold-400 transition-all">
                여 ♀
              </div>
            </label>
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Calendar className="w-4 h-4" /> 생년월일
          </label>
          <input
            {...register('birthDate', { required: true })}
            type="date"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors [color-scheme:dark]"
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              {...register('isLunar')}
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50"
            />
            <span className="text-gray-400 text-sm">음력으로 입력</span>
          </label>
        </div>

        {/* Birth Hour */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Clock className="w-4 h-4" /> 태어난 시간
          </label>
          <select
            {...register('birthHour')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors appearance-none"
          >
            {BIRTH_HOURS.map((h) => (
              <option key={h.value} value={h.value} className="bg-slate-900 text-white">
                {h.label}
              </option>
            ))}
          </select>
        </div>

        {/* Concern */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <MessageSquare className="w-4 h-4" /> 현재 고민/관심사 (선택)
          </label>
          <textarea
            {...register('concern', { maxLength: 200 })}
            placeholder="올해 이직을 고민 중입니다. 재물운과 직업운이 궁금해요."
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors resize-none"
          />
          <p className="text-right text-gray-500 text-xs mt-1">{concern.length}/200</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold text-lg hover:from-gold-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
        >
          <Sparkles className="w-5 h-5" />
          사주 보기
        </button>
      </form>
    </div>
  );
}
