import React from 'react';

export default function ProposalBackground({ currentBackground }) {
  return (
    <>
      <div
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          backgroundImage: `url('${currentBackground}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-10" />
    </>
  );
}
