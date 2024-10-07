'use client';

import Preview from '../Preview';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';

const Random = () => {
  const { movies, movie, index, onIndexChange, fetchNextPage } = useRandomMovie();

  return (
    <>
      <div className='absolute left-0 bottom-0 w-full h-[calc(100vh-56px)] bg-background' />
      {/* <div className='absolute h-[calc(100vh-56px)] w-full bottom-0 left-0 flex items-center blur-[4px]'>
        <div className='absolute bottom-0 left-0 w-full h-[calc(100vh-56px)] bg-black/70' />
        <div
          style={{ backgroundImage: `url(${movie?.backdrop})`, transition: 'background 200ms linear' }}
          className='bg-no-repeat bg-cover h-[calc(100vh-56px)] w-full'
        />
      </div> */}
      <div className='h-[calc(100vh-112px)] w-full flex-1 flex flex-col justify-center items-center'>
        <Preview
          show={movie}
          className='max-w-[800px] z-20 relative'
          card={<Carousel index={index} shows={movies} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
        />
      </div>
    </>
  );
};

export default Random;
