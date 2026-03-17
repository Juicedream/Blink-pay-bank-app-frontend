import { CameraIcon, PlusCircle, QrCode } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='h-full flex flex-col gap-2 items-center mt-4'>
        <div className='flex flex-row sm:flex-col md:flex-col w-full justify-between px-16'>
            <button className='ring-1 p-4 rounded-2xl flex gap-4 hover:cursor-pointer hover:shadow-lg hover:shadow-black hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white hover:ring-0'>
                <QrCode />
                Generate QR Code
                <PlusCircle />
            </button>
            <button className='ring-1 p-4 rounded-2xl flex gap-4 hover:cursor-pointer hover:shadow-lg hover:shadow-black hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white hover:ring-0'>
                <CameraIcon />
                Scan QR Code
                <QrCode />
            </button>
            
        </div>
    </div>
  )
}

export default page