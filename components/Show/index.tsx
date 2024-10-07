import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import Poster from '@/components/Show/components/Poster';
import Rating from '@/components/Show/components/Rating';
import { cn } from '@/lib/utils';

import Favorite from './components/Favorite';
import Handlers from './components/Handlers';

interface Props {
  show?: Show;
  onClick?: () => void;
  className?: string;
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

const Show: FC<Props> = ({ show, onClick, className, containerProps }) => {
  if (!show) return null;

  return (
    <div
      {...(containerProps || {})}
      className={cn(
        'card-aspect-ratio relative bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden text-lg',
        className
      )}
    >
      <div className='flex size-full'>
        <img className='size-full object-cover' src={show.poster} alt={show.title} />
      </div>
      <Handlers show={show} onClick={onClick} />
    </div>
  );
};

export default Show;
