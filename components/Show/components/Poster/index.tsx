import { FC } from 'react';
import { ImageOff } from 'lucide-react';

interface Props {
  title: string;
  poster: string;
}

const Poster: FC<Props> = ({ title, poster }) => {
  return <img className='size-full object-cover' src={poster} alt={title} />;
};

export default Poster;
