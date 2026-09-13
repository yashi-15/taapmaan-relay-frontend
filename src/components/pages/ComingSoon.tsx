import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center h-96 gap-2'>
      <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-2'>
        ✨
      </div>
      <h1 className='text-zinc-800 text-2xl font-bold'>Coming Soon</h1>
      <p className='text-zinc-500 text-sm'>This module is under active development.</p>
    </div>
  );
};

export default ComingSoon;
