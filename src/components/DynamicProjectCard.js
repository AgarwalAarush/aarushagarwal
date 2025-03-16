import dynamic from 'next/dynamic'

// Import the component dynamically with SSR disabled
const DynamicProjectCard = dynamic(
  () => import('./ProjectCard'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-6 bg-[#0a0c14] border border-[#1e1e2d] rounded-lg h-full flex flex-col">
        <div className="mb-4 h-48 bg-[#1e1e2d] animate-pulse rounded-md"></div>
        <div className="h-7 bg-[#1e1e2d] animate-pulse rounded mb-3 w-3/4"></div>
        <div className="h-20 bg-[#1e1e2d] animate-pulse rounded mb-4"></div>
        <div className="flex flex-wrap mb-4 gap-2">
          <div className="h-6 w-16 bg-[rgba(76,201,240,0.1)] animate-pulse rounded-full"></div>
          <div className="h-6 w-20 bg-[rgba(76,201,240,0.1)] animate-pulse rounded-full"></div>
        </div>
        <div className="flex mt-auto space-x-5">
          <div className="h-4 w-16 bg-[#1e1e2d] animate-pulse rounded"></div>
          <div className="h-4 w-20 bg-[#1e1e2d] animate-pulse rounded"></div>
        </div>
      </div>
    )
  }
)

export default DynamicProjectCard