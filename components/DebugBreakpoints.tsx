"use client"

const DebugBreakpoints = () => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed top-0 right-0 z-50 bg-black text-white p-2 text-xs font-mono">
      <div className="block xs:hidden">XS</div>
      <div className="hidden xs:block sm:hidden">XS</div>
      <div className="hidden sm:block md:hidden">SM</div>
      <div className="hidden md:block lg:hidden">MD</div>
      <div className="hidden lg:block xl:hidden">LG</div>
      <div className="hidden xl:block 2xl:hidden">XL</div>
      <div className="hidden 2xl:block">2XL</div>
    </div>
  );
};

export default DebugBreakpoints; 