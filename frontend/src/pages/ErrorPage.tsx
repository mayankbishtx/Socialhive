export default function ErrorPage() {
    return (
        <div className="h-[calc(100vh-72px)] flex flex-col items-center justify-center text-sm max-md:px-4 pb-12">
            
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-black to-gray-400 dark:bg-linear-to-r dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
                404 Not Found
            </h1>
            
            <div className="h-px w-80 rounded bg-linear-to-r from-black to-gray-400 dark:bg-linear-to-r dark:from-gray-400 dark:to-gray-800 my-5 md:my-7"></div>
            
            <p className="md:text-xl text-gray-600 dark:text-gray-400 max-w-lg text-center">
                The page you are looking for does not exist or has been moved.
            </p>
            
            <a href="/" className="group flex items-center gap-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 px-7 py-2.5 dark:text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all">
                Back to Home
                <svg className="group-hover:translate-x-0.5 transition" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </a>
            
        </div>
    )
}