'use client';

import { FC, ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import Card from '@/components/Show';
import Credits from '@/components/Show/components/Credits';
import { Modal } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Color, { useColor, usePalette } from 'color-thief-react';

import Actions from './components/Actions';
import useDetails from './useDetails';

interface Props {
  show?: Show;
  className?: string;
  onClose?: () => void;
  children?: ReactNode;
  card?: ReactNode;
}

const Preview: FC<Props> = ({ show: initialShow, className, onClose, children, card }) => {
  const { data: detailedShow } = useDetails({ showId: initialShow?.id, showType: initialShow?.type });

  const show = detailedShow || initialShow;

  if (!show) return null;

  return (
    <div className={cn('rounded-xl shadow-lg', className)}>
      <div
        className='absolute inset-0 bg-glow rounded-xl animate-glow z-[-1] blur-[15px]'
        style={{
          backgroundSize: '300%'
        }}
      />
      <div className='flex flex-col md:flex-row z-20 bg-background rounded-xl overflow-hidden'>
        {card || <Card className='mx-auto' show={show} />}
        <div className='flex grow flex-col p-5 bg-background'>
          <p className='uppercase mb-3 text-2xl'>{show.title}</p>
          <p className='flex gap-5 mb-3'>
            <span>{new Date(show.release).getFullYear()}</span>
            <span>{show.runtime} min</span>
            <span>{show.genres?.map(({ name }) => name).join(', ')}</span>
          </p>
          <p key={show.id} className='mb-3'>
            {show.overview}
          </p>
        </div>
      </div>
    </div>
  );
};

export const showPreviewModal = create(({ onResolve, onClose, show }: Props & InstanceProps<void>) => (
  <Modal className='block p-0' onClose={onResolve}>
    <Preview
      show={show}
      className='border-none'
      onClose={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose?.();
        onResolve();
      }}
    />
  </Modal>
));

export default Preview;
