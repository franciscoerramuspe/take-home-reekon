import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <div className="bg-[#1A1A1A] p-4 rounded-sm"> */}
        <Image
          src="/logo_no_bg.png"
          alt="Reekon Logo"
          width={140}
          height={40}
          className="h-8 w-auto"
        />
        {/* <div className="h-[2px] w-full bg-[#FFD700] mt-2" /> */}
      </div>
  
  )
}

