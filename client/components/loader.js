const Loader = () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="absolute -top-10 left-0 right-0 text-center text-blue-500 font-semibold">
            Loading...
          </p>
        </div>
      </div>
    )
  }
  
  export default Loader
  