import { useForm } from 'react-hook-form';
import type { SajuInput } from '../types/saju.types';

export function useSajuForm() {
  const form = useForm<SajuInput>({
    defaultValues: {
      name: '',
      gender: 'male',
      birthDate: '',
      birthHour: '모름',
      isLunar: false,
      concern: '',
    },
  });

  return form;
}
