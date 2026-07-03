export default function LoadingPage() {
    return (
        <div className="h-[calc(100vh-76px)] flex space-x-2 justify-center items-center pb-20 relative">

            <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" />

            <div className='h-8 w-8 bg-black dark:bg-white  rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-black dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-black dark:bg-white rounded-full animate-bounce'></div>
            
        </div>
    )
}