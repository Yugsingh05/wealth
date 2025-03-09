
import { statsData } from '@/data/landing'
import React from 'react'

const Stats = () => {
  return (
    <div className='py-20 bg-blue-50'>
        <div className='container mx-auto px-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                {statsData.map((stat, index) => (
                    <div key={index} className='text-center'>
                        <h2 className='text-4xl font-bold text-blue-600 mb-2'>{stat.value}</h2>
                        <p className='text-gray-600'>{stat.label}</p>
                    </div>
                ))}

            </div>

        </div>
    </div>
  )
}

export default Stats