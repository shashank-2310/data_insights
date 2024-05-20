import Link from 'next/link'
import React from 'react'

type Props = {}

const Footer = (props: Props) => {
    return (
        <div className='bg-black text-center text-white p-8'>
            <h1 className='font-medium'>Made by: Shashank Gupta</h1>
            <p>Reach out: <span className='text-blue-400 hover:text-blue-200'><Link href="mailto:shashankgupta944@gmail.com" target="_blank">shashankgupta944@gmail.com</Link></span></p>
            <Link className='text-blue-400 hover:text-blue-200 p-2' href="https://drive.google.com/file/d/11C_B_DHHeDBvL9CGw9K4PjLFrhVsn9m2/view?usp=sharing" download="ShashankGupta_21BCS8963_Resume.pdf" target="_blank">
                Download Resume
            </Link>
        </div>
    )
}

export default Footer