import SearcBar from '../components/SearchBar';
function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[760px] mb-2'>
        <video
          autoPlay
          loop
          muted
          className='absolute w-full h-full object-cover'
          preload='auto'
        >
          <source src='/landing-video.mp4' type='video/mp4' />
        </video>
        <div className='absolute w-full h-full bg-black opacity-20' />
        <div className='relative text-white flex flex-col items-center justify-center h-full p-4 text-center'>
          <h1 className='text-4xl lg:text-5xl font-bold mb-10'>
            Start Your Culinary Journey
          </h1>
          <SearcBar />
          <div className='flex space-x-4 justify-evenly lg:w-1/2 w-11/12 text-lg font-semibold'>
            <button className='bg-red-500  w-full  py-2 rounded-3xl hover:bg-red-600 '>
              Italian
            </button>
            <button className='bg-white text-red-500  w-full py-2 rounded-3xl hover:bg-gray-200'>
              Chinese
            </button>
            <button className='bg-red-500  py-2 w-full rounded-3xl hover:bg-red-600'>
              Mexican
            </button>
          </div>
        </div>
      </div>

      
      <div className='px-8 py-16 text-center bg-white flex flex-col items-center '>
        <h2 className='text-3xl font-bold mb-4'>Why Reserve With Us?</h2>
        <p className='mb-4'>
          Discover top-rated restaurants and reliable user reviews to guide your
          next meal.
        </p>
        <div className='flex justify-center w-full '>
          <div className='flex flex-col lg:flex-row justify-center max-w-screen-lg gap-6'>
            <div className='p-4 text-left w-full'>
              <div className='h-64 w-full overflow-hidden rounded-3xl'>
                <img
                  src='/reservation.jpg'
                  alt='Easy Booking'
                  className='object-cover w-full h-full'
                />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-gray-800 mt-7'>
                Effortless way to dine
              </h3>
              <p className='text-gray-700'>
                Reserve your table in just a few clicks on our user-friendly
                platform.
              </p>
            </div>
            <div className='p-4 text-left w-full'>
              <div className='w-full h-64 overflow-hidden rounded-3xl'>
                <img
                  src='/experince.jpg'
                  alt='Selected Eateries'
                  className='object-cover w-full h-full'
                />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-gray-800 mt-7'>
                Selected Eateries
              </h3>
              <p className='text-gray-700'>
                Handpicked restaurants to ensure the best dining experiences.
              </p>
            </div>
            <div className='p-4 text-left w-full'>
              <div className='w-full h-64 overflow-hidden rounded-3xl'>
                {/* Bad image change it later */}
                <img
                  src='/rate.jpg'
                  alt='Trusted Reviews'
                  className='object-cover w-full h-full -translate-x-5'
                />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-gray-800 mt-7'>
                Trusted Reviews
              </h3>
              <p className='text-gray-700'>
                Real feedback from real diners to help you make the perfect
                choice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className='bg-gray-100 p-8 text-center border-t'>
        <h3 className='text-2xl font-semibold mb-2'>Ready to dine?</h3>
        <p className='mb-2'>
          Book your table now and treat yourself to a memorable meal.
        </p>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Find Restaurants
        </button>
      </div>
    </div>
  );
}

export default Home;
